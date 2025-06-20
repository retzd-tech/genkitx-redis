import { createClient } from "redis"; // Removed SchemaFieldTypes, VectorAlgorithms as they are not used here

import { IndexerFlowOptions, PluginOptions } from "../interfaces"; // Assuming IndexerFlowOptions might still be needed or can be removed if not used

// Updated saveVectorIndex function
const saveVectorIndex = async (
  key: string, // Unique key for storing the vector
  vector: number[], // Vector data (array of numbers)
  pluginOptions: PluginOptions // Assuming pluginOptions might contain Redis connection details or API key
) => {
  const { apiKey } = pluginOptions; // Assuming apiKey is still relevant, otherwise remove
  if (!apiKey) return "No API key provided"; // Or handle API key validation as needed

  const client = createClient(); // Consider moving client creation/connection to a shared utility if used by multiple functions
  try {
    await client.connect();
    // Store the vector using HSET. Vectors are stored as JSON strings.
    // Redis hashes store field-value pairs. Here, 'vector' is the field name.
    await client.hSet(key, "vector", JSON.stringify(vector));
    return "Vector data saved successfully";
  } catch (error: any) {
    console.error("Error saving vector data:", error);
    return `Error saving vector data: ${error.message}`;
  } finally {
    if (client.isOpen) {
      await client.quit();
    }
  }
};

// New function to get vector data
const getVectorIndex = async (
  key: string, // Unique key for retrieving the vector
  pluginOptions: PluginOptions // Assuming pluginOptions might contain Redis connection details or API key
) => {
  const { apiKey } = pluginOptions; // Assuming apiKey is still relevant
  if (!apiKey) return "No API key provided"; // Or handle API key validation

  const client = createClient(); // Similar to saveVectorIndex, consider shared client management
  try {
    await client.connect();
    // Retrieve the vector data using HGET
    // Assumes the vector was stored with field name 'vector'
    const vectorString = await client.hGet(key, "vector");

    if (vectorString) {
      // Parse the JSON string back into an array of numbers
      const vector = JSON.parse(vectorString);
      return vector;
    } else {
      return `No vector data found for key: ${key}`;
    }
  } catch (error: any) {
    console.error("Error getting vector data:", error);
    return `Error getting vector data: ${error.message}`;
  } finally {
    if (client.isOpen) {
      await client.quit();
    }
  }
};

export { saveVectorIndex, getVectorIndex };
