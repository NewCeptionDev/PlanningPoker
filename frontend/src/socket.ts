'use client'

import { io, Socket } from 'socket.io-client'

export const socket =
  process.env.NEXT_PUBLIC_CUSTOM_URL !== undefined
    ? io(process.env.NEXT_PUBLIC_CUSTOM_URL, {
        autoConnect: false,
        transports: ['websocket'],
      })
    : io({
        autoConnect: false,
        transports: ['websocket'],
      })
