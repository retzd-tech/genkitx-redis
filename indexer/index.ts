import { createClient, SchemaFieldTypes, VectorAlgorithms } from "redis";

import { IndexerFlowOptions, PluginOptions } from "../interfaces";

const saveVectorIndex = async (
  flowOptions: IndexerFlowOptions,
  pluginOptions: PluginOptions
) => {
  const { indexName } = flowOptions;
  const { apiKey } = pluginOptions;
  if (!apiKey) return "No API key provided"
  try {
    const client = createClient();
    await client.connect();
    await client.ft.create(
      indexName,
      {
        v: {
          type: SchemaFieldTypes.VECTOR,
          ALGORITHM: VectorAlgorithms.HNSW,
          TYPE: "FLOAT32",
          DIM: 2,
          DISTANCE_METRIC: "COSINE",
        },
      },
      {
        ON: "HASH",
        PREFIX: "noderedis:knn",
      }
    );
    return "Vector saved successfully";
  } catch (error: any) {
    if (error.message === "Index already exists") {
      return "Index exists already, skipped creation.";
    }
    return `"Error : " ${error}`;
  }
};

export { saveVectorIndex };
