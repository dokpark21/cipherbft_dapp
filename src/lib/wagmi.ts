import { http, createConfig } from 'wagmi'
import { createPublicClient, createWalletClient, defineChain } from 'viem'
import { privateKeyToAccount } from 'viem/accounts'

// Custom CipherBFT chain definition
export const cipherBFT = defineChain({
  id: 85300,
  name: 'CipherBFT',
  nativeCurrency: {
    decimals: 18,
    name: 'CIPHER',
    symbol: 'CPH',
  },
  rpcUrls: {
    default: {
      http: ['/api/rpc'],
    },
  },
})

// Private key account for auto-signing
const PRIVATE_KEY = '0x7c852118294e51e653712a81e05800f419141751be58f605c371e15141b007a6' as const
export const account = privateKeyToAccount(PRIVATE_KEY)

// Public client for reading
export const publicClient = createPublicClient({
  chain: cipherBFT,
  transport: http('/api/rpc'),
})

// Wallet client for writing (auto-sign with private key)
export const walletClient = createWalletClient({
  account,
  chain: cipherBFT,
  transport: http('/api/rpc'),
})

export const config = createConfig({
  chains: [cipherBFT],
  transports: {
    [cipherBFT.id]: http('/api/rpc'),
  },
})

// Contract configuration
export const GAME_CONTRACT_ADDRESS = '0x057ef64E23666F000b34aE31332854aCBd1c8544' as const

export const GAME_CONTRACT_ABI = [
  {
    type: 'function',
    name: 'endGame',
    inputs: [{ name: 'score', type: 'uint256', internalType: 'uint256' }],
    outputs: [],
    stateMutability: 'nonpayable',
  },
  {
    type: 'function',
    name: 'recordMove',
    inputs: [
      { name: 'direction', type: 'uint8', internalType: 'uint8' },
      { name: 'x', type: 'uint256', internalType: 'uint256' },
      { name: 'z', type: 'uint256', internalType: 'uint256' },
    ],
    outputs: [],
    stateMutability: 'nonpayable',
  },
  {
    type: 'function',
    name: 'startGame',
    inputs: [],
    outputs: [],
    stateMutability: 'nonpayable',
  },
  {
    type: 'event',
    name: 'GameOver',
    inputs: [
      { name: 'player', type: 'address', indexed: true, internalType: 'address' },
      { name: 'score', type: 'uint256', indexed: false, internalType: 'uint256' },
      { name: 'timestamp', type: 'uint256', indexed: false, internalType: 'uint256' },
    ],
    anonymous: false,
  },
  {
    type: 'event',
    name: 'GameStart',
    inputs: [
      { name: 'player', type: 'address', indexed: true, internalType: 'address' },
      { name: 'timestamp', type: 'uint256', indexed: false, internalType: 'uint256' },
    ],
    anonymous: false,
  },
  {
    type: 'event',
    name: 'Move',
    inputs: [
      { name: 'player', type: 'address', indexed: true, internalType: 'address' },
      { name: 'direction', type: 'uint8', indexed: false, internalType: 'uint8' },
      { name: 'x', type: 'uint256', indexed: false, internalType: 'uint256' },
      { name: 'z', type: 'uint256', indexed: false, internalType: 'uint256' },
      { name: 'timestamp', type: 'uint256', indexed: false, internalType: 'uint256' },
    ],
    anonymous: false,
  },
] as const

declare module 'wagmi' {
  interface Register {
    config: typeof config
  }
}
