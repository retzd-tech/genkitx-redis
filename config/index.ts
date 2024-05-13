import * as z from "zod";

import {
  FLOW_NAME_INDEXER,
  SCHEMA_INDEX_NAME,
  SCHEMA_RESULT,
} from "./../constants";

export const indexerflowConfig = {
  name: FLOW_NAME_INDEXER,
  inputSchema: z.object({
    indexName: z.string().describe(SCHEMA_INDEX_NAME)
  }),
  outputSchema: z.string().describe(SCHEMA_RESULT),
};
