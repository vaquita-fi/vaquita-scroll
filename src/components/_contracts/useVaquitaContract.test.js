import { optimismSepolia } from 'viem/chains';
import VaquitaABI from './VaquitaABI.ts';
import { useVaquitaContract } from './useVaquitaContract.ts';

describe('useVaquitaContract', () => {
  it('should return correct contract data', () => {
    const contract = useVaquitaContract();
    expect(contract).toEqual({
      abi: VaquitaABI,
      address: '0x8522D7762A8C3a71ddf5f52b6DA19849BAB87F1d',
      status: 'ready',
      supportedChains: [optimismSepolia],
    });
  });
});
