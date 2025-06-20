import * as z from "zod";

import {
  FLOW_NAME_INDEXER,
  SCHEMA_INDEX_NAME,
  SCHEMA_RESULT,
  FLOW_NAME_RETRIEVER, // Now imported from constants
  SCHEMA_KEY, // Now imported from constants
  SCHEMA_RESULT_RETRIEVER, // Now imported from constants
} from "./../constants";

// Placeholder constants removed

export const indexerflowConfig = {
  name: FLOW_NAME_INDEXER,
  inputSchema: z.object({
    key: z.string().describe(SCHEMA_KEY), // Key for storing the vector
    vector: z.array(z.number()).describe("The vector data to store (array of numbers)"),
    // indexName is optional and might be used for context or if index creation is ever co-located.
    // For HSET operation, indexName is not directly used by saveVectorIndex,
    // but keeping it optional if other related operations might need it.
    indexName: z.string().optional().describe(SCHEMA_INDEX_NAME),
  }),
  outputSchema: z.string().describe(SCHEMA_RESULT), // Output is a status message string
};

export const retrieverFlowConfig = {
  name: FLOW_NAME_RETRIEVER, // Uses imported constant
  inputSchema: z.object({
    key: z.string().describe(SCHEMA_KEY), // Uses imported constant
  }),
  // Output can be the vector (array/object) or an error string.
  // Using z.any() for flexibility, as vector structure might be complex.
  outputSchema: z.any().describe(SCHEMA_RESULT_RETRIEVER), // Uses imported constant
};
