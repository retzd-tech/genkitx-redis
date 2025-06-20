import { saveVectorIndex, getVectorIndex } from "../indexer"; // Added getVectorIndex
import { IndexerFlowOptions, PluginOptions } from "./../interfaces";

export const redisIndexerAction = async (
  flowOptions: IndexerFlowOptions,
  pluginOptions: PluginOptions
) => {
  try {
    const { key, vector } = flowOptions;

    if (!key) {
      return "Error: Key is missing in flowOptions for redisIndexerAction";
    }
    if (!vector) {
      return "Error: Vector data is missing in flowOptions for redisIndexerAction";
    }
    // Ensure vector is an array of numbers, though type system should help.
    if (!Array.isArray(vector) || !vector.every(v => typeof v === 'number')) {
      return "Error: Vector data must be an array of numbers.";
    }

    return await saveVectorIndex(key, vector, pluginOptions);
  } catch (error: any) {
    return `Error in redisIndexerAction: ${error.message || error}`;
  }
};

// New action to retrieve vector data
export const redisRetrieverAction = async (
  flowOptions: IndexerFlowOptions,
  pluginOptions: PluginOptions
) => {
  try {
    if (!flowOptions.key) {
      return "Error: Key is missing in flowOptions for redisRetrieverAction";
    }
    return await getVectorIndex(flowOptions.key, pluginOptions);
  } catch (error: any) {
    // The error from getVectorIndex should already be a string message
    // but catching just in case something else throws here.
    return `Error in redisRetrieverAction: ${error.message || error}`;
  }
};
