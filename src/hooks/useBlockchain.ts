'use client'

import { useCallback, useEffect, useState, useRef } from 'react'
import { keccak256, toHex } from 'viem'
import { useGameStore } from '@/store/gameStore'
import {
  GAME_CONTRACT_ADDRESS,
  GAME_CONTRACT_ABI,
  publicClient,
  walletClient,
  account
} from '@/lib/wagmi'

interface TxMetrics {
  pendingCount: number
  confirmedCount: number
  avgConfirmTime: number
  tps: number
}

// Global nonce manager - 완전 비동기
let currentNonce: number | null = null
let nonceInitialized = false

export function useBlockchain() {
  const { addTx, confirmTx } = useGameStore()

  const [metrics, setMetrics] = useState<TxMetrics>({
    pendingCount: 0,
    confirmedCount: 0,
    avgConfirmTime: 0,
    tps: 0
  })

  const [txTimes, setTxTimes] = useState<number[]>([])
  const [isConnected, setIsConnected] = useState(false)
  const [mockMode, setMockMode] = useState(true)

  // 블록체인 연결 확인 및 nonce 초기화
  useEffect(() => {
    publicClient.getBlockNumber()
      .then(async () => {
        if (!nonceInitialized) {
          currentNonce = await publicClient.getTransactionCount({ address: account.address })
          nonceInitialized = true
        }
        setIsConnected(true)
        setMockMode(false)
      })
      .catch(() => {
        setIsConnected(false)
        setMockMode(true)
      })
  }, [])

  // 메트릭 업데이트 (백그라운드)
  const updateMetrics = useCallback((startTime: number, txHash: string) => {
    const endTime = Date.now()
    const actualTime = endTime - startTime

    confirmTx(txHash)

    setTxTimes(prev => {
      const newTimes = [...prev, actualTime].slice(-100)
      const avg = newTimes.reduce((a, b) => a + b, 0) / newTimes.length
      const tps = newTimes.length / (newTimes.reduce((a, b) => a + b, 0) / 1000) || 0

      setMetrics(m => ({
        ...m,
        pendingCount: Math.max(0, m.pendingCount - 1),
        confirmedCount: m.confirmedCount + 1,
        avgConfirmTime: Math.round(avg),
        tps: Math.round(tps * 10) / 10
      }))

      return newTimes
    })
  }, [confirmTx])

  // Mock 트랜잭션 (블록체인 미연결 시)
  const simulateTx = useCallback((type: string, data: Record<string, unknown>) => {
    const txHash = keccak256(toHex(`${Date.now()}-${Math.random()}-${JSON.stringify(data)}`))
    const startTime = Date.now()

    addTx({
      hash: txHash,
      type: type as 'move' | 'score' | 'death',
      data,
      timestamp: startTime,
      confirmed: false
    })

    setMetrics(prev => ({ ...prev, pendingCount: prev.pendingCount + 1 }))

    setTimeout(() => {
      updateMetrics(startTime, txHash)
    }, 10 + Math.random() * 40)
  }, [addTx, updateMetrics])

  // 🔥 Fire-and-forget 트랜잭션 (게임 블로킹 없음)
  const fireTransaction = useCallback((
    functionName: 'startGame' | 'recordMove' | 'endGame',
    args: unknown[],
    type: 'move' | 'score' | 'death',
    data: Record<string, unknown>
  ) => {
    if (currentNonce === null) return

    const nonce = currentNonce++
    const startTime = Date.now()
    const tempHash = keccak256(toHex(`pending-${nonce}-${Date.now()}`))

    // UI 즉시 업데이트
    addTx({
      hash: tempHash,
      type,
      data,
      timestamp: startTime,
      confirmed: false
    })
    setMetrics(prev => ({ ...prev, pendingCount: prev.pendingCount + 1 }))

    // 백그라운드에서 트랜잭션 전송
    walletClient.writeContract({
      address: GAME_CONTRACT_ADDRESS,
      abi: GAME_CONTRACT_ABI,
      functionName,
      nonce,
      args: args as never
    })
      .then(txHash => {
        // 트랜잭션 전송 완료, confirmation 대기
        publicClient.waitForTransactionReceipt({ hash: txHash })
          .then(() => updateMetrics(startTime, tempHash))
          .catch(console.error)
      })
      .catch(err => {
        console.error(`${functionName} failed:`, err)
        // 실패 시 pending 카운트 감소
        setMetrics(prev => ({ ...prev, pendingCount: Math.max(0, prev.pendingCount - 1) }))
      })
  }, [addTx, updateMetrics])

  // 게임 시작 기록
  const startGame = useCallback(() => {
    if (mockMode) {
      simulateTx('score', { action: 'start' })
    } else {
      fireTransaction('startGame', [], 'score', { action: 'start' })
    }
  }, [mockMode, simulateTx, fireTransaction])

  // 이동 기록 (완전 비동기 - 게임 안 멈춤)
  const recordMove = useCallback((direction: string, position: { x: number; z: number }) => {
    if (mockMode) {
      simulateTx('move', { direction, ...position })
    } else {
      const directionMap: Record<string, number> = { forward: 0, back: 1, left: 2, right: 3 }
      fireTransaction(
        'recordMove',
        [
          directionMap[direction] || 0,
          BigInt(Math.floor(Math.abs(position.x) * 1000)),
          BigInt(Math.floor(Math.abs(position.z) * 1000))
        ],
        'move',
        { direction, ...position }
      )
    }
  }, [mockMode, simulateTx, fireTransaction])

  // 게임 종료 기록
  const endGame = useCallback((score: number) => {
    if (mockMode) {
      simulateTx('death', { score })
    } else {
      fireTransaction('endGame', [BigInt(score)], 'death', { score })
    }
  }, [mockMode, simulateTx, fireTransaction])

  return {
    isConnected,
    address: account.address,
    chainId: 31337,
    mockMode,
    metrics,
    recordMove,
    startGame,
    endGame
  }
}
