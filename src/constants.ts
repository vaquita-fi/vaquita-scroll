export const OPTIMISM_SEPOLIA_CHAIN_ID = 11155420;
export const mintContractAddress = '0xA3e40bBe8E8579Cd2619Ef9C6fEA362b760dac9f';
export const VAQUITA_CONTRACT_ADDRESS = "0x1250e296dEfbe47fbFd5c3eD1B8194120f21497B";
export const OP_SEPOLIA_USDC = "0x00D2d1162c689179e8bA7a3b936f80A010A0b5CF".toLowerCase().trim() as `0x${string}`;
export const USDC_DECIMALS = 1000000;
export const mintABI = [
  {
    inputs: [
      {
        internalType: 'address',
        name: 'to',
        type: 'address',
      },
    ],
    name: 'mint',
    outputs: [],
    stateMutability: 'public',
    type: 'function',
  },
] as const;
