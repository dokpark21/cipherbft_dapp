import { http, createConfig } from 'wagmi'
import { createPublicClient, createWalletClient, defineChain } from 'viem'
import { privateKeyToAccount } from 'viem/accounts'

// Custom CipherBFT chain definition
export const cipherBFT = defineChain({
  id: 31337,
  name: 'CipherBFT',
  nativeCurrency: {
    decimals: 18,
    name: 'CIPHER',
    symbol: 'CPH',
  },
  rpcUrls: {
    default: {
      http: ['http://127.0.0.1:8545'],
    },
  },
  blockExplorers: {
    default: { name: 'CipherScan', url: 'http://localhost:4000' },
  },
})

// Private key account for auto-signing
const PRIVATE_KEY = '0xac0974bec39a17e36ba4a6b4d238ff944bacb478cbed5efcae784d7bf4f2ff80' as const
export const account = privateKeyToAccount(PRIVATE_KEY)

// Public client for reading
export const publicClient = createPublicClient({
  chain: cipherBFT,
  transport: http('http://127.0.0.1:8545'),
})

// Wallet client for writing (auto-sign with private key)
export const walletClient = createWalletClient({
  account,
  chain: cipherBFT,
  transport: http('http://127.0.0.1:8545'),
})

export const config = createConfig({
  chains: [cipherBFT],
  transports: {
    [cipherBFT.id]: http('http://127.0.0.1:8545'),
  },
})

// Contract configuration
export const GAME_CONTRACT_ADDRESS = '0x5FbDB2315678afecb367f032d93F642f64180aa3' as const

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
