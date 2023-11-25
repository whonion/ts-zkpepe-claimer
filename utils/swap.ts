import { createPublicClient, http } from 'viem'
import { zkSync } from 'viem/chains'

const client = createPublicClient({
    chain: zkSync,
    transport: http(),
  })