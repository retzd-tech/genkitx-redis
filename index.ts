import { genkitPlugin } from "@genkit-ai/core";
import { defineFlow } from "@genkit-ai/flow";

import { PluginOptions } from "./interfaces";
import { redisIndexerAction } from "./actions";
import { indexerflowConfig } from "./config";
import { checkApiKey } from "./utilities";
import { PLUGIN_NAME_INDEXER } from "./constants";

export const redisRetriever = genkitPlugin(
  PLUGIN_NAME_INDEXER,
  async (pluginOptions: PluginOptions) => {
    checkApiKey(pluginOptions);
    defineFlow(indexerflowConfig, (flowOptions) =>
      redisIndexerAction(flowOptions, pluginOptions)
    );
  }
);
