import type { PromptConfig, PromptConfigItem, Prompts } from '@/.';

import {
  PipelinePromptTemplate,
  PromptTemplate,
} from '@langchain/core/prompts';
import { dump as dumpYaml } from 'js-yaml';
import isArray from 'lodash/isArray.js';
import isString from 'lodash/isString.js';

import { getConfig } from '@/config/index.js';
import log from '@/log/index.js';
import { tools } from '@/tool/index.js';
import { DEFAULT_PROMPTS, DEFAULTS } from './constants.js';
import { isPromptPipeline } from './types.js';

const prompts: Prompts = new Map();
const baseParams: Record<string, string> = {};

export const getToolDescriptions = () => {
  const descriptions = Object.values(tools).map((tool) => tool.description);

  log('getToolDescriptions', 'debug', { descriptions });
  return dumpYaml(descriptions);
};

export const newPrompt = () => {
  return {
    get: (
      promptName: string,
      params: Record<string, unknown> = {},
    ): Promise<string> => {
      const prompt = prompts.get(promptName);
      if (!prompt) {
        throw new Error(`Prompt ${promptName} not found`);
      }

      const promptString = prompt.format({
        ...baseParams,
        ...params,
      });

      log('newPrompt data', 'debug', {
        promptName,
        params,
        promptString,
      });

      return promptString;
    },
  };
};

export const initPrompts = () => {
  const config = getConfig();
  const configPrompts: PromptConfig = DEFAULT_PROMPTS;
  baseParams['availableTools'] = getToolDescriptions();

  Object.entries(DEFAULTS).forEach(([key, value]) => {
    baseParams[key] = value;
  });

  Object.entries(configPrompts).forEach(([name, prompt]) => {
    if (isString(prompt)) {
      prompts.set(name, PromptTemplate.fromTemplate(prompt));
    } else if (prompt instanceof PromptTemplate) {
      prompts.set(name, prompt);
    }
  });

  Object.entries(configPrompts).forEach(
    ([name, prompt]: [string, PromptConfigItem]) => {
      if (!isPromptPipeline(prompt)) return;
      const pipelinePromptItems = isArray(prompt.pipeline)
        ? prompt.pipeline
        : prompt.pipeline(config);

      const pipelinePrompts = pipelinePromptItems.map((step) => ({
        name: step,
        prompt: prompts.get(step) as PromptTemplate,
      }));

      const promptTemplate = new PipelinePromptTemplate<PromptTemplate>({
        finalPrompt: prompts.get(prompt.final) as PromptTemplate,
        pipelinePrompts,
      });
      prompts.set(name, promptTemplate);
    },
  );

  return newPrompt();
};

export * from './types.js';
