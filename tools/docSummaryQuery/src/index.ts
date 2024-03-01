import type {
  Config,
  Tool,
  ToolRunParamsCommon,
  ToolRunReturn,
} from '@interrobangc/codellm';
import type { ToolConfig } from './types';

import { toolUtils } from '@interrobangc/codellm';
import {
  DEFAULT_CONFIG,
  description,
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

  const vectorizeFilesClient = await toolUtils.vectorizeFiles.newClient(
    toolName,
    config,
    toolConfig,
  );

  return {
    run: async (params: ToolRunParamsCommon): Promise<ToolRunReturn> => {
      const dbResponse = await vectorizeFilesClient.query({
        ...params,
        toolName,
      });

      const content = JSON.stringify(
        // @ts-expect-error - types aren't in place yet
        dbResponse.map((d) => ({
          path: d.metadata.path,
          summary: d.document,
          content: d.metadata.content,
          distance: d.distance,
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