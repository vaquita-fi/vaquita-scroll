import { type Hex } from 'viem'

export const getChainByName = (viemChains: any, chainName: string) => {
    if (chainName in viemChains) {
        return viemChains[chainName as keyof typeof viemChains];
    }
    throw new Error(`Chain ${chainName} not found in viem/chains`);
};

export function uuidToBytes16(uuid: string): Hex {
  // Remove hyphens from the UUID
  const strippedUuid = uuid.replace(/-/g, '')
  
  // Ensure it's a valid UUID without hyphens (should be 32 hex chars)
  if (strippedUuid.length !== 32) {
    throw new Error('Invalid UUID format')
  }
  
  // Return as a hex string with 0x prefix
  return `0x${strippedUuid}` as Hex
}