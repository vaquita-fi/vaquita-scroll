import { optimismSepolia } from 'viem/chains';
import { Environment } from '../environment';
import { getChainsForEnvironment } from '../supportedChains';

describe('supportedChains', () => {
  describe('getChainsForEnvironment', () => {
    it('should return testnet for localhost', () => {
      expect(getChainsForEnvironment(Environment.localhost)).toEqual([optimismSepolia]);
    });

    it('should default to localhost', () => {
      expect(getChainsForEnvironment()).toEqual([optimismSepolia]);
    });

    it('should return mainnet for production', () => {
      expect(getChainsForEnvironment(Environment.production)).toEqual([optimismSepolia]);
    });
  });

  describe('getChainById', () => {
    it('should return null if chain is not found', () => {
      expect(getChainsForEnvironment(Environment.localhost)).toEqual([optimismSepolia]);
    });

    it('should return the chain if found', () => {
      expect(getChainsForEnvironment(Environment.localhost)).toEqual([optimismSepolia]);
    });
  });
});
