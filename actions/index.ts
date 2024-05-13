import { saveVectorIndex } from "../indexer";
import { IndexerFlowOptions, PluginOptions } from "./../interfaces";

export const redisIndexerAction = async (
  flowOptions: IndexerFlowOptions,
  pluginOptions: PluginOptions
) => {
  try {
    return await saveVectorIndex(flowOptions, pluginOptions);
  } catch (error) {
    return `Error saving vector index, ${error}`;
  }
};
