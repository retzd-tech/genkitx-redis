import { genkitPlugin } from "@genkit-ai/core";
import { defineFlow } from "@genkit-ai/flow";

import { PluginOptions } from "./interfaces";
import { redisIndexerAction, redisRetrieverAction } from "./actions"; // Added redisRetrieverAction
import { indexerflowConfig, retrieverFlowConfig } from "./config"; // Added retrieverFlowConfig
import { checkApiKey } from "./utilities";
import { PLUGIN_NAME_INDEXER } from "./constants";

export const redisRetriever = genkitPlugin(
  PLUGIN_NAME_INDEXER,
  async (pluginOptions: PluginOptions) => {
    checkApiKey(pluginOptions);
    defineFlow(indexerflowConfig, (flowOptions) =>
      redisIndexerAction(flowOptions, pluginOptions)
    );
    defineFlow(retrieverFlowConfig, (flowOptions) => // Added new defineFlow for retriever
      redisRetrieverAction(flowOptions, pluginOptions)
    );
  }
);
