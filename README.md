# Genkit Redis Vector Store Plugin

## Purpose

This Genkit plugin provides vector storage and retrieval functionalities using Redis. It allows you to integrate Redis as a vector database in your Genkit applications, enabling you to build Retrieval Augmented Generation (RAG) systems and other applications requiring vector similarity search.

## Core Functionalities

The plugin offers two main flows:

1.  **Storing Vectors (`redisIndexerAction`)**:
    *   This flow allows you to store numerical vector embeddings in your Redis database.
    *   Each vector is associated with a unique key for later retrieval.
    *   It utilizes the `HSET` command in Redis to store vectors.

2.  **Retrieving Vectors (`redisRetrieverAction`)**:
    *   This flow enables you to retrieve previously stored vectors from Redis using their unique key.
    *   It uses the `HGET` command to fetch the vector.

## Configuration & Flow Inputs

When defining flows in your Genkit application using this plugin, you'll configure them with specific input schemas.

### 1. Storing Vectors Flow (`indexerflowConfig`)

This flow is typically associated with the `redisIndexerAction`.

*   **Flow Name (example):** `redisVectorIndexer` (derived from `FLOW_NAME_INDEXER`, e.g., "Redis Retriever" as per current constants)
*   **Input Schema:**
    *   `key` (string, required): The unique key under which the vector will be stored in Redis. (Described by `SCHEMA_KEY`)
    *   `vector` (array of numbers, required): The numerical vector data to store.
    *   `indexName` (string, optional): A descriptive name for the index or context. While not directly used by the underlying `HSET` operation for saving a single vector, it can be useful for organizing or managing different sets of vectors. (Described by `SCHEMA_INDEX_NAME`)
*   **Output Schema:** (string) A status message indicating the outcome of the operation (e.g., "Vector data saved successfully" or an error message).

### 2. Retrieving Vectors Flow (`retrieverFlowConfig`)

This flow is typically associated with the `redisRetrieverAction`.

*   **Flow Name (example):** `redisVectorRetriever` (derived from `FLOW_NAME_RETRIEVER`, e.g., "Redis Key Retriever" as per current constants)
*   **Input Schema:**
    *   `key` (string, required): The unique key of the vector to retrieve from Redis. (Described by `SCHEMA_KEY`)
*   **Output Schema:** (any) The retrieved vector data (typically an array of numbers) if found, a message indicating the key was not found, or an error message.

## Usage Example

Here's a conceptual example of how you might define and use these flows in a Genkit TypeScript application:

```typescript
import { configureGenkit } from '@genkit-ai/core';
import { redisRetriever } from 'genkitx-redis'; // Assuming 'genkitx-redis' is the plugin package name
import { runFlow } from '@genkit-ai/flow';

// Initialize Genkit with the Redis plugin
// Plugin options (like API key for Redis, if applicable) would be passed here
configureGenkit({
  plugins: [
    redisRetriever({ apiKey: process.env.REDIS_API_KEY }), // Example plugin initialization
  ],
  logLevel: 'debug',
  enableTracingAndMetrics: true,
});

async function storeAndRetrieveVector() {
  const uniqueKey = 'my-sample-vector-123';
  const sampleVector = [0.1, 0.2, 0.3, 0.4, 0.5];

  // Note: The flow names used below ('Redis Retriever', 'Redis Key Retriever')
  // directly reference the values of FLOW_NAME_INDEXER and FLOW_NAME_RETRIEVER
  // as defined in the plugin's constants.ts.
  // Ensure these names match your plugin's exported flow configurations.

  // Store a vector
  try {
    const storeResult = await runFlow('Redis Retriever' as any, {
      key: uniqueKey,
      vector: sampleVector,
      indexName: 'my-document-embeddings', // Optional context
    });
    console.log('Store Result:', storeResult);

    // Retrieve the vector
    const retrieveResult = await runFlow('Redis Key Retriever' as any, {
      key: uniqueKey,
    });
    console.log('Retrieve Result:', retrieveResult);

    if (Array.isArray(retrieveResult)) {
      // Successfully retrieved the vector
      console.log('Vector length:', retrieveResult.length);
    }

  } catch (error) {
    console.error('Error during flow execution:', error);
  }
}

storeAndRetrieveVector();
```

## Setup

To use this plugin, you would typically:

1.  Install the plugin package: `npm install genkitx-redis` (assuming this is the package name).
2.  Ensure your Redis instance is running and accessible.
3.  Configure the plugin when initializing Genkit, providing any necessary options (like API keys or Redis connection details if the plugin supports them directly, or ensure environment variables are set if the plugin relies on them).

This plugin simplifies the process of using Redis as a vector store within the Genkit ecosystem.