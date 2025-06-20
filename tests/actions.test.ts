import { redisIndexerAction, redisRetrieverAction } from '../actions';
import { IndexerFlowOptions, PluginOptions } from '../interfaces';
import { saveVectorIndex, getVectorIndex } from '../indexer';

// Mock the indexer functions
jest.mock('../indexer', () => ({
  saveVectorIndex: jest.fn(),
  getVectorIndex: jest.fn(),
}));

describe('Action Functions', () => {
  const mockPluginOptions: PluginOptions = { apiKey: 'test-api-key' };

  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('redisIndexerAction', () => {
    const testKey = 'action-save-key';
    const testVector = [1, 2, 3];
    const validFlowOptions: IndexerFlowOptions = { key: testKey, vector: testVector };

    it('should call saveVectorIndex with correct parameters and return its result', async () => {
      const successMessage = 'Successfully saved from action';
      (saveVectorIndex as jest.Mock).mockResolvedValue(successMessage);

      const result = await redisIndexerAction(validFlowOptions, mockPluginOptions);

      expect(saveVectorIndex).toHaveBeenCalledWith(testKey, testVector, mockPluginOptions);
      expect(result).toBe(successMessage);
    });

    it('should return error if key is missing in flowOptions', async () => {
      const flowOptionsNoKey: IndexerFlowOptions = { vector: testVector };
      const result = await redisIndexerAction(flowOptionsNoKey, mockPluginOptions);
      expect(result).toBe('Error: Key is missing in flowOptions for redisIndexerAction');
      expect(saveVectorIndex).not.toHaveBeenCalled();
    });

    it('should return error if vector is missing in flowOptions', async () => {
      const flowOptionsNoVector: IndexerFlowOptions = { key: testKey };
      const result = await redisIndexerAction(flowOptionsNoVector, mockPluginOptions);
      expect(result).toBe('Error: Vector data is missing in flowOptions for redisIndexerAction');
      expect(saveVectorIndex).not.toHaveBeenCalled();
    });

    it('should return error if vector is not an array of numbers', async () => {
      const flowOptionsInvalidVector: IndexerFlowOptions = { key: testKey, vector: 'not-a-vector' as any };
      const result = await redisIndexerAction(flowOptionsInvalidVector, mockPluginOptions);
      expect(result).toBe('Error: Vector data must be an array of numbers.');
      expect(saveVectorIndex).not.toHaveBeenCalled();
    });

    it('should propagate errors from saveVectorIndex', async () => {
      const errorMessage = 'Error from saveVectorIndex';
      (saveVectorIndex as jest.Mock).mockRejectedValue(new Error(errorMessage));

      const result = await redisIndexerAction(validFlowOptions, mockPluginOptions);
      expect(saveVectorIndex).toHaveBeenCalledWith(testKey, testVector, mockPluginOptions);
      expect(result).toBe(`Error in redisIndexerAction: ${errorMessage}`);
    });
  });

  describe('redisRetrieverAction', () => {
    const testKey = 'action-retrieve-key';
    const validFlowOptions: IndexerFlowOptions = { key: testKey };
    const mockRetrievedData = { data: [1, 2, 3] };

    it('should call getVectorIndex with correct parameters and return its result', async () => {
      (getVectorIndex as jest.Mock).mockResolvedValue(mockRetrievedData);

      const result = await redisRetrieverAction(validFlowOptions, mockPluginOptions);

      expect(getVectorIndex).toHaveBeenCalledWith(testKey, mockPluginOptions);
      expect(result).toBe(mockRetrievedData);
    });

    it('should return error if key is missing in flowOptions', async () => {
      const flowOptionsNoKey: IndexerFlowOptions = {};
      const result = await redisRetrieverAction(flowOptionsNoKey, mockPluginOptions);
      expect(result).toBe('Error: Key is missing in flowOptions for redisRetrieverAction');
      expect(getVectorIndex).not.toHaveBeenCalled();
    });

    it('should propagate errors from getVectorIndex', async () => {
      const errorMessage = 'Error from getVectorIndex';
      (getVectorIndex as jest.Mock).mockRejectedValue(new Error(errorMessage));

      const result = await redisRetrieverAction(validFlowOptions, mockPluginOptions);
      expect(getVectorIndex).toHaveBeenCalledWith(testKey, mockPluginOptions);
      expect(result).toBe(`Error in redisRetrieverAction: ${errorMessage}`);
    });
  });
});
