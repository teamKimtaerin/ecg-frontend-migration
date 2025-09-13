'use client'

import React from 'react'
import dynamic from 'next/dynamic'

// Dynamically import the modal to avoid SSR issues
const TranscriptionProgressModal = dynamic(
  () => import('@/components/TranscriptionProgressModal'),
  { ssr: false }
)

interface TranscriptionProviderProps {
  children: React.ReactNode
}

export const TranscriptionProvider: React.FC<TranscriptionProviderProps> = ({
  children,
}) => {
  return (
    <>
      {children}
      <TranscriptionProgressModal />
    </>
  )
}
