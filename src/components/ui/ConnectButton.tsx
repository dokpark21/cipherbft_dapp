'use client'

import { useAccount, useConnect, useDisconnect } from 'wagmi'
import { injected } from 'wagmi/connectors'

export function ConnectButton() {
  const { address, isConnected } = useAccount()
  const { connect, isPending } = useConnect()
  const { disconnect } = useDisconnect()

  if (isConnected && address) {
    return (
      <button
        onClick={() => disconnect()}
        className="bg-gray-800 hover:bg-gray-700 text-white px-4 py-2 rounded-lg font-mono text-sm flex items-center gap-2 transition-colors"
      >
        <span className="w-2 h-2 rounded-full bg-green-400" />
        {address.slice(0, 6)}...{address.slice(-4)}
      </button>
    )
  }

  return (
    <button
      onClick={() => connect({ connector: injected() })}
      disabled={isPending}
      className="bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-400 hover:to-blue-500 disabled:opacity-50 text-white px-4 py-2 rounded-lg font-semibold text-sm transition-all"
    >
      {isPending ? 'Connecting...' : 'Connect Wallet'}
    </button>
  )
}
