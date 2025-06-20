export interface IndexerFlowOptions {
  indexName?: string; // Made optional as not all actions might need it
  key?: string; // Added for retriever action / saving action
  vector?: number[]; // Added for passing vector data for saving
}

export interface PluginOptions {
  apiKey?: string;
}