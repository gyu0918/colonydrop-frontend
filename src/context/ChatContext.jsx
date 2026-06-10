import { createContext, useContext, useState, useEffect, useRef, useCallback } from 'react'
import { Client } from '@stomp/stompjs'
import SockJS from 'sockjs-client'
import { useAuth } from './AuthContext'
import api from '../utils/api'

const ChatContext = createContext(null)

export const ROOMS = [
  { id: 'gundam', label: '건담' },
  { id: 'openrun', label: '오픈런' },
  { id: 'sharing', label: '나눔' },
  { id: 'free', label: '자유' },
]

const WS_URL = `${import.meta.env.VITE_API_URL || 'http://localhost:8080'}/ws`

const INITIAL_MESSAGES = { gundam: [], openrun: [], sharing: [], free: [] }
const INITIAL_ROOM_USERS = { gundam: 0, openrun: 0, sharing: 0, free: 0 }

export function ChatProvider({ children }) {
  const { token, user, nickname } = useAuth()
  const stompClientRef = useRef(null)
  const [connected, setConnected] = useState(false)
  const [currentRoom, setCurrentRoom] = useState('free')
  const [messages, setMessages] = useState(INITIAL_MESSAGES)
  const [totalUsers, setTotalUsers] = useState(0)
  const [roomUsers, setRoomUsers] = useState(INITIAL_ROOM_USERS)
  const currentRoomRef = useRef('free')
  const chatSubRef = useRef(null)
  const loadingRoomsRef = useRef(new Set())
  const wsBufferRef = useRef({})

  useEffect(() => {
    currentRoomRef.current = currentRoom
  }, [currentRoom])

  const loadHistory = useCallback(async (roomType) => {
    loadingRoomsRef.current.add(roomType)
    wsBufferRef.current[roomType] = []
    try {
      const res = await api.get(`/api/chat/history/${roomType}`)
      const serverMsgs = (res.data || []).reverse()
      const buffered = wsBufferRef.current[roomType] || []
      setMessages(prev => ({ ...prev, [roomType]: [...serverMsgs, ...buffered] }))
    } catch (e) {
      console.error('채팅 히스토리 로드 실패', e)
    } finally {
      loadingRoomsRef.current.delete(roomType)
      wsBufferRef.current[roomType] = []
    }
  }, [])

  const subscribeRoom = useCallback((client, roomType) => {
    if (chatSubRef.current) {
      try { chatSubRef.current.unsubscribe() } catch {}
      chatSubRef.current = null
    }
    chatSubRef.current = client.subscribe(`/topic/chat/${roomType}`, (frame) => {
      try {
        const msg = JSON.parse(frame.body)
        const key = msg.roomType?.toLowerCase() ?? roomType
        if (loadingRoomsRef.current.has(key)) {
          wsBufferRef.current[key] = [...(wsBufferRef.current[key] || []), msg]
        } else {
          setMessages(prev => ({
            ...prev,
            [key]: [...(prev[key] || []), msg],
          }))
        }
      } catch {}
    })
  }, [])

  useEffect(() => {
    const client = new Client({
      webSocketFactory: () => new SockJS(WS_URL),
      reconnectDelay: 3000,
      onConnect: () => {
        setConnected(true)

        api.get('/api/chat/site/users')
          .then(res => setTotalUsers(res.data.count))
          .catch(() => {})

        ROOMS.forEach(({ id }) => {
          api.get(`/api/chat/users/${id}`)
            .then(res => setRoomUsers(prev => ({ ...prev, [id]: res.data.count })))
            .catch(() => {})
        })

        client.subscribe('/topic/users', (frame) => {
          try { setTotalUsers(Number(JSON.parse(frame.body))) } catch {}
        })

        client.subscribe('/topic/chat/users', (frame) => {
          try {
            const data = JSON.parse(frame.body)
            if (data?.roomType) {
              setRoomUsers(prev => ({ ...prev, [data.roomType.toLowerCase()]: data.count }))
            }
          } catch {}
        })

        subscribeRoom(client, currentRoomRef.current)
        loadHistory(currentRoomRef.current)
      },
      onDisconnect: () => setConnected(false),
      onStompError: (frame) => console.error('STOMP 오류', frame),
    })
    client.activate()
    stompClientRef.current = client

    return () => { client.deactivate() }
  }, [subscribeRoom, loadHistory])

  const switchRoom = useCallback(async (roomType) => {
    setCurrentRoom(roomType)
    currentRoomRef.current = roomType
    if (stompClientRef.current?.connected) {
      subscribeRoom(stompClientRef.current, roomType)
    }
    await loadHistory(roomType)
  }, [subscribeRoom, loadHistory])

  const sendMessage = useCallback((content) => {
    if (!stompClientRef.current?.connected || !token || !user || !content.trim()) return
    const senderName = nickname ?? user?.memberId ?? 'anonymous'
    stompClientRef.current.publish({
      destination: `/app/chat/${currentRoomRef.current}`,
      body: JSON.stringify({ senderId: senderName, content: content.trim() }),
      headers: { Authorization: `Bearer ${token}` },
    })
  }, [token, user, nickname])

  return (
    <ChatContext.Provider value={{
      connected,
      currentRoom,
      messages,
      totalUsers,
      roomUsers,
      switchRoom,
      sendMessage,
      ROOMS,
    }}>
      {children}
    </ChatContext.Provider>
  )
}

export const useChat = () => useContext(ChatContext)
