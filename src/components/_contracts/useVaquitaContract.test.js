import VaquitaABI from './VaquitaABI.ts';
import { useVaquitaContract } from './useVaquitaContract.ts';
import { sepolia } from 'viem/chains';

describe('useVaquitaContract', () => {
  it('should return correct contract data', () => {
    const contract = useVaquitaContract();
    expect(contract).toEqual({
      abi: VaquitaABI,
      address: '0x8b8c0E33c0b6C246C5323192789e163bf7B331Ea',
      status: 'ready',
      supportedChains: [sepolia],
    });
  });
});
