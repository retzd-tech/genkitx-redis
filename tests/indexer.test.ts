import { saveVectorIndex, getVectorIndex } from '../indexer';
import { PluginOptions } from '../interfaces';
import { createClient } from 'redis';

// Mock the 'redis' library
jest.mock('redis', () => {
  const mockHSet = jest.fn();
  const mockHGet = jest.fn();
  const mockConnect = jest.fn();
  const mockQuit = jest.fn();
  const mockFtCreate = jest.fn(); // Though not used by saveVectorIndex anymore, it was in the original

  return {
    createClient: jest.fn(() => ({
      connect: mockConnect,
      hSet: mockHSet,
      hGet: mockHGet,
      ft: {
        create: mockFtCreate, // Keep if other parts of redis client are used elsewhere via this mock
      },
      quit: mockQuit,
      isOpen: true, // Mock isOpen property, default to true after connect
    })),
    // Export other things if your code uses them, e.g., SchemaFieldTypes, VectorAlgorithms
    SchemaFieldTypes: {
      VECTOR: 'VECTOR',
    },
    VectorAlgorithms: {
      HNSW: 'HNSW',
    },
  };
});

describe('Indexer Utilities', () => {
  let mockRedisClient: any;
  const mockApiKeyPluginOptions: PluginOptions = { apiKey: 'test-api-key' };
  const mockNoApiKeyPluginOptions: PluginOptions = {};

  beforeEach(() => {
    // Reset all mocks (including createClient's call count from previous tests)
    jest.clearAllMocks();
    // Get a reference to the mock client instance that the functions under test will use
    mockRedisClient = createClient();
    // Now, specifically reset the call count of the createClient factory mock itself,
    // so we only count calls made by the function under test, not the one above.
    (createClient as jest.Mock).mockClear();
  });

  describe('saveVectorIndex', () => {
    const testKey = 'test-vector-key';
    const testVector = [1, 2, 3, 4, 5];

    it('should save a vector successfully', async () => {
      (mockRedisClient.hSet as jest.Mock).mockResolvedValue(1); // Simulate successful HSET

      const result = await saveVectorIndex(testKey, testVector, mockApiKeyPluginOptions);

      expect(createClient).toHaveBeenCalledTimes(1);
      expect(mockRedisClient.connect).toHaveBeenCalledTimes(1);
      expect(mockRedisClient.hSet).toHaveBeenCalledWith(testKey, 'vector', JSON.stringify(testVector));
      expect(mockRedisClient.quit).toHaveBeenCalledTimes(1);
      expect(result).toBe('Vector data saved successfully');
    });

    it('should return "No API key provided" if apiKey is missing', async () => {
      const result = await saveVectorIndex(testKey, testVector, mockNoApiKeyPluginOptions);
      expect(result).toBe('No API key provided');
      expect(mockRedisClient.connect).not.toHaveBeenCalled();
    });

    it('should handle errors during HSET', async () => {
      const errorMessage = 'HSET error';
      (mockRedisClient.hSet as jest.Mock).mockRejectedValue(new Error(errorMessage));

      const result = await saveVectorIndex(testKey, testVector, mockApiKeyPluginOptions);

      expect(mockRedisClient.connect).toHaveBeenCalledTimes(1);
      expect(mockRedisClient.hSet).toHaveBeenCalledWith(testKey, 'vector', JSON.stringify(testVector));
      expect(mockRedisClient.quit).toHaveBeenCalledTimes(1);
      expect(result).toBe(`Error saving vector data: ${errorMessage}`);
    });
  });

  describe('getVectorIndex', () => {
    const testKey = 'test-retrieve-key';
    const storedVector = [5, 4, 3, 2, 1];
    const storedVectorString = JSON.stringify(storedVector);

    it('should retrieve and parse a vector successfully', async () => {
      (mockRedisClient.hGet as jest.Mock).mockResolvedValue(storedVectorString);

      const result = await getVectorIndex(testKey, mockApiKeyPluginOptions);

      expect(createClient).toHaveBeenCalledTimes(1);
      expect(mockRedisClient.connect).toHaveBeenCalledTimes(1);
      expect(mockRedisClient.hGet).toHaveBeenCalledWith(testKey, 'vector');
      expect(mockRedisClient.quit).toHaveBeenCalledTimes(1);
      expect(result).toEqual(storedVector);
    });

    it('should return "No API key provided" if apiKey is missing', async () => {
      const result = await getVectorIndex(testKey, mockNoApiKeyPluginOptions);
      expect(result).toBe('No API key provided');
      expect(mockRedisClient.connect).not.toHaveBeenCalled();
    });

    it('should handle non-existent key', async () => {
      (mockRedisClient.hGet as jest.Mock).mockResolvedValue(null); // Simulate key not found

      const result = await getVectorIndex('non-existent-key', mockApiKeyPluginOptions);

      expect(mockRedisClient.connect).toHaveBeenCalledTimes(1);
      expect(mockRedisClient.hGet).toHaveBeenCalledWith('non-existent-key', 'vector');
      expect(mockRedisClient.quit).toHaveBeenCalledTimes(1);
      expect(result).toBe('No vector data found for key: non-existent-key');
    });

    it('should handle errors during HGET', async () => {
      const errorMessage = 'HGET error';
      (mockRedisClient.hGet as jest.Mock).mockRejectedValue(new Error(errorMessage));

      const result = await getVectorIndex(testKey, mockApiKeyPluginOptions);

      expect(mockRedisClient.connect).toHaveBeenCalledTimes(1);
      expect(mockRedisClient.hGet).toHaveBeenCalledWith(testKey, 'vector');
      expect(mockRedisClient.quit).toHaveBeenCalledTimes(1);
      expect(result).toBe(`Error getting vector data: ${errorMessage}`);
    });

    it('should handle malformed JSON data from HGET', async () => {
      (mockRedisClient.hGet as jest.Mock).mockResolvedValue("{malformed_json'");

      const result = await getVectorIndex(testKey, mockApiKeyPluginOptions);

      expect(mockRedisClient.connect).toHaveBeenCalledTimes(1);
      expect(mockRedisClient.hGet).toHaveBeenCalledWith(testKey, 'vector');
      expect(mockRedisClient.quit).toHaveBeenCalledTimes(1);
      // Error message depends on JSON.parse, usually "Unexpected token..." or similar
      expect(result).toContain('Error getting vector data:');
    });
  });
});
