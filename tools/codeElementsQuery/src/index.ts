import type {
  Config,
  Tool,
  ToolRunParamsCommon,
  ToolRunReturn,
  VectorDbQueryResultItem,
} from '@codellm/core';
import type { ToolConfig } from './types';

import { toolUtils } from '@codellm/core';
import { dump as dumpYaml } from 'js-yaml';
import {
  DEFAULT_CONFIG,
  description,
  numResults,
  summarizeTaskPrompt,
} from './constants.js';

/**
 * Create a new codeSummaryQuery tool
 *
 * @param toolName - The name of the tool
 * @param config - The configuration to use
 *
 * @returns - The new tool instance
 */
export const newTool = async (
  toolName: string,
  config: Config,
): Promise<Tool> => {
  const toolConfig = {
    ...DEFAULT_CONFIG,
    ...(config.tools?.[toolName]?.config as Partial<ToolConfig>),
  } as ToolConfig;

  const vectorizeFilesClient = await toolUtils.vectorizeFiles.newClient({
    toolName,
    config,
    toolConfig,
  });

  return {
    run: async ({ params }: ToolRunParamsCommon): Promise<ToolRunReturn> => {
      const dbResponse = await vectorizeFilesClient.query({
        query: params['query'] as unknown as string,
        numResults,
      });

      const content = dumpYaml(
        dbResponse.map((d: VectorDbQueryResultItem) => ({
          distance: d.distance,
          fileContent: params['includeCode']
            ? d.metadata['fileContent']
            : undefined,
          filePath: d.metadata['filePath'],
          summary: d.document,
        })),
      );

      return { success: true, content };
    },
    import: async () => {
      await vectorizeFilesClient.vectorizeFiles({
        summarize: summarizeTaskPrompt,
      });
      return { success: true, content: 'Import complete' };
    },
    description,
  };
};