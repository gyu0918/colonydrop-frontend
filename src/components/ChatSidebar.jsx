import { useEffect, useRef, useState } from 'react'
import { useChat } from '../context/ChatContext'
import { useAuth } from '../context/AuthContext'
import styles from './ChatSidebar.module.css'

export default function ChatSidebar() {
  const { connected, currentRoom, messages, switchRoom, sendMessage, ROOMS } = useChat()
  const { token, user } = useAuth()
  const [input, setInput] = useState('')
  const [isOpen, setIsOpen] = useState(false)
  const messagesEndRef = useRef(null)
  const inputRef = useRef(null)

  const myId = user?.memberId ?? user?.sub ?? user?.id
  const currentMessages = messages[currentRoom] || []

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [currentMessages.length, currentRoom])

  const handleSend = () => {
    if (!input.trim() || !token || !connected) return
    sendMessage(input.trim())
    setInput('')
    inputRef.current?.focus()
  }

  const handleKeyDown = (e) => {
    if (e.nativeEvent.isComposing) return
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault()
      handleSend()
    }
  }

  return (
    <div className={styles.container}>
      <button
        className={styles.toggleBtn}
        onClick={() => setIsOpen(prev => !prev)}
        aria-label="채팅 열기/닫기"
      >
        {isOpen ? '✕' : '💬'}
      </button>
      <div className={`${styles.panel} ${isOpen ? styles.panelOpen : ''}`}>
        <div className={styles.header}>
          <span className={styles.headerTitle}>실시간 채팅</span>
          <span className={`${styles.dot} ${connected ? styles.dotOn : ''}`} />
        </div>

        <div className={styles.tabs}>
          {ROOMS.map(room => (
            <button
              key={room.id}
              className={`${styles.tab} ${currentRoom === room.id ? styles.activeTab : ''}`}
              onClick={() => switchRoom(room.id)}
            >
              {room.label}
            </button>
          ))}
        </div>

        <div className={styles.messages}>
          {currentMessages.length === 0 ? (
            <p className={styles.empty}>아직 메시지가 없습니다</p>
          ) : (
            currentMessages.map((msg, i) => {
              const isMe = myId && msg.senderId === myId
              const displayName = msg.senderName ?? msg.senderId
              return (
                <div key={i} className={`${styles.msgRow} ${isMe ? styles.msgRowMe : ''}`}>
                  {!isMe && <span className={styles.sender}>{displayName}</span>}
                  <div className={`${styles.bubble} ${isMe ? styles.bubbleMe : styles.bubbleOther}`}>
                    {msg.content}
                  </div>
                </div>
              )
            })
          )}
          <div ref={messagesEndRef} />
        </div>

        <div className={styles.inputArea}>
          {token ? (
            <>
              <input
                ref={inputRef}
                className={styles.input}
                type="text"
                placeholder="메시지 입력..."
                value={input}
                onChange={e => setInput(e.target.value)}
                onKeyDown={handleKeyDown}
                maxLength={200}
              />
              <button
                className={styles.sendBtn}
                onClick={handleSend}
                disabled={!input.trim() || !connected}
              >
                전송
              </button>
            </>
          ) : (
            <p className={styles.loginMsg}>로그인 후 채팅 가능합니다</p>
          )}
        </div>
      </div>
    </div>
  )
}
