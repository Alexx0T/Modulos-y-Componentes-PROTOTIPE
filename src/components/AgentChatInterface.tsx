import React, { useState, useRef, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import type { Message } from '../store/useCatalogStore'

interface AgentChatInterfaceProps {
  messages: Message[]
  onSendMessage: (text: string) => void
  onClearChat: () => void
  isTyping?: boolean
}

export const AgentChatInterface: React.FC<AgentChatInterfaceProps> = ({
  messages,
  onSendMessage,
  onClearChat,
  isTyping = false
}) => {
  const [input, setInput] = useState('')
  const messagesEndRef = useRef<HTMLDivElement>(null)

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
  }

  useEffect(() => {
    scrollToBottom()
  }, [messages, isTyping])

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (!input.trim()) return
    onSendMessage(input)
    setInput('')
  }

  return (
    <div className="flex flex-col h-[520px] rounded-2xl glass-premium overflow-hidden gpu-accelerated relative">
      {/* Chat Header */}
      <div className="px-6 py-4 border-b border-white/5 flex items-center justify-between bg-zinc-950/40">
        <div className="flex items-center space-x-3">
          <div className="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-pulse" />
          <div>
            <h3 className="font-semibold text-zinc-100 text-sm">PROTOTIPE AI Agent</h3>
            <p className="text-xs text-zinc-400">Modelo: Gemini 3.5 Flash</p>
          </div>
        </div>
        <button
          onClick={onClearChat}
          className="text-xs text-zinc-400 hover:text-rose-400 transition-colors duration-200 cursor-pointer flex items-center space-x-1"
        >
          <svg className="w-3.5 h-3.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <path strokeLinecap="round" strokeLinejoin="round" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
          </svg>
          <span>Reiniciar</span>
        </button>
      </div>

      {/* Messages Scroll Area */}
      <div className="flex-1 overflow-y-auto p-6 space-y-4">
        <AnimatePresence initial={false}>
          {messages.map((msg) => {
            const isAssistant = msg.role === 'assistant'
            return (
              <motion.div
                key={msg.id}
                initial={{ opacity: 0, y: 15 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.95 }}
                transition={{ duration: 0.25 }}
                className={`flex ${isAssistant ? 'justify-start' : 'justify-end'} gpu-accelerated`}
              >
                <div
                  className={`max-w-[85%] rounded-2xl px-4 py-3 ${
                    isAssistant
                      ? 'bg-zinc-900 border border-zinc-800 text-zinc-200'
                      : 'bg-primary text-white shadow-md shadow-primary/10'
                  }`}
                >
                  {/* Assistant Extra Details */}
                  {isAssistant && msg.status === 'executing' && msg.toolExecutions && (
                    <div className="mb-2 p-2.5 rounded-lg bg-zinc-950/60 border border-zinc-800 text-xs font-mono space-y-2">
                      <div className="text-primary flex items-center space-x-1.5">
                        <svg className="w-3.5 h-3.5 animate-spin" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"></path>
                        </svg>
                        <span className="font-bold">Ejecutando herramienta...</span>
                      </div>
                      {msg.toolExecutions.map((tool, idx) => (
                        <div key={idx} className="border-t border-zinc-800/80 pt-1.5 mt-1.5">
                          <div className="text-zinc-300 font-semibold">{tool.name}()</div>
                          <div className="text-zinc-500 mt-0.5">Parámetros: {JSON.stringify(tool.params)}</div>
                          <div className="text-zinc-400 bg-zinc-900/60 p-1.5 rounded mt-1 overflow-x-auto text-[11px]">
                            {tool.output}
                          </div>
                        </div>
                      ))}
                    </div>
                  )}

                  <div className="text-sm whitespace-pre-wrap leading-relaxed">{msg.content}</div>
                  <div className="text-[10px] text-zinc-500 text-right mt-1.5 select-none">
                    {msg.timestamp}
                  </div>
                </div>
              </motion.div>
            )
          })}

          {/* Typing indicator - CLS-safe structure */}
          {isTyping && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="flex justify-start min-h-[46px]" // Reserve height to avoid shifting layout
            >
              <div className="bg-zinc-900 border border-zinc-800 rounded-2xl px-4 py-3 flex items-center space-x-1">
                <span className="w-2 h-2 rounded-full bg-zinc-500 animate-bounce" style={{ animationDelay: '0ms' }} />
                <span className="w-2 h-2 rounded-full bg-zinc-500 animate-bounce" style={{ animationDelay: '150ms' }} />
                <span className="w-2 h-2 rounded-full bg-zinc-500 animate-bounce" style={{ animationDelay: '300ms' }} />
              </div>
            </motion.div>
          )}
        </AnimatePresence>
        <div ref={messagesEndRef} />
      </div>

      {/* Chat Footer Input */}
      <form onSubmit={handleSubmit} className="p-4 border-t border-white/5 bg-zinc-950/20">
        <div className="flex items-center space-x-2">
          <input
            type="text"
            placeholder="Hazle una pregunta al Agente..."
            value={input}
            onChange={(e) => setInput(e.target.value)}
            disabled={isTyping}
            className="flex-1 px-4 py-2.5 rounded-xl bg-zinc-900/90 border border-zinc-800 text-zinc-100 placeholder-zinc-500 focus:outline-none focus:ring-2 focus:ring-primary/40 focus:border-primary text-sm disabled:opacity-50 transition-all duration-200"
          />
          <button
            type="submit"
            disabled={isTyping || !input.trim()}
            className="p-2.5 rounded-xl bg-primary hover:bg-primary-hover text-white transition-all duration-300 disabled:opacity-50 cursor-pointer shadow-lg shadow-primary/10 hover:shadow-primary/20"
          >
            <svg className="w-4 h-4 transform rotate-90" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
              <path strokeLinecap="round" strokeLinejoin="round" d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8" />
            </svg>
          </button>
        </div>
      </form>
    </div>
  )
}
