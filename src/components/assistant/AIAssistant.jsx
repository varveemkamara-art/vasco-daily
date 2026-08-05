import { useState } from 'react'
import { supabase } from '../../lib/supabaseClient'

function AIAssistant({ occurrences, userName }) {
  const [isOpen, setIsOpen] = useState(false)
  const [messages, setMessages] = useState([
    { role: 'assistant', text: "Hi! I'm Vasco Assistant. Ask me anything about your tasks or day." },
  ])
  const [input, setInput] = useState('')
  const [loading, setLoading] = useState(false)

  async function handleSend(e) {
    e.preventDefault()
    if (!input.trim()) return

    const userMessage = input
    setMessages((prev) => [...prev, { role: 'user', text: userMessage }])
    setInput('')
    setLoading(true)

    try {
      const { data: sessionData } = await supabase.auth.getSession()
      const token = sessionData?.session?.access_token

      const response = await fetch(
        `${import.meta.env.VITE_SUPABASE_URL}/functions/v1/ai-assistant`,
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${import.meta.env.VITE_SUPABASE_PUBLISHABLE_KEY}`,
          },
          body: JSON.stringify({
            message: userMessage,
            tasks: occurrences,
            userName,
          }),
        }
      )

      const data = await response.json()
      const rawReply = data.reply || data.error || 'Something went wrong.'
      const replyText = rawReply.replace(/\*\*/g, '').replace(/^#+\s*/gm, '')
      setMessages((prev) => [...prev, { role: 'assistant', text: replyText }])
    } catch (err) {
      setMessages((prev) => [
        ...prev,
        { role: 'assistant', text: 'Sorry, something went wrong reaching the assistant.' },
      ])
    } finally {
      setLoading(false)
    }
  }

  return (
    <>
      {/* Floating button */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="fixed bottom-4 right-4 bg-blue-600 hover:bg-blue-700 text-white w-14 h-14 rounded-full shadow-lg flex items-center justify-center text-2xl z-50 overflow-hidden"
      >
        {isOpen ? '×' : <img src="/icon-192.png" alt="Assistant" className="w-full h-full object-cover" />}
      </button>
      {/* Chat window */}
      {isOpen && (
        <div className="fixed bottom-20 right-4 w-80 max-w-[90vw] h-96 bg-white dark:bg-slate-800 rounded-lg shadow-xl flex flex-col z-50 border border-gray-200 dark:border-slate-700">
          <div className="p-3 border-b border-gray-200 dark:border-slate-700">
            <h3 className="text-sm font-semibold text-slate-900 dark:text-white">
              Vasco Assistant
            </h3>
          </div>

          <div className="flex-1 overflow-y-auto p-3 space-y-2">
            {messages.map((msg, i) => (
              <div
                key={i}
                className={`text-sm p-2 rounded-lg max-w-[85%] ${
                  msg.role === 'user'
                    ? 'bg-blue-600 text-white ml-auto'
                    : 'bg-gray-100 dark:bg-slate-700 text-slate-900 dark:text-white'
                }`}
             >
                {msg.text.split('\n').map((line, idx) => (
                  <p key={idx} className={line.trim() === '' ? 'h-2' : 'mb-1'}>
                    {line}
                  </p>
                ))}
              </div>
            ))}
            {loading && (
              <div className="text-sm text-slate-500 dark:text-slate-400">Thinking...</div>
            )}
          </div>

          <form onSubmit={handleSend} className="p-3 border-t border-gray-200 dark:border-slate-700 flex gap-2">
            <input
              type="text"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder="Ask something..."
              className="flex-1 p-2 rounded bg-gray-100 dark:bg-slate-700 text-slate-900 dark:text-white outline-none text-sm"
            />
            <button
              type="submit"
              className="bg-blue-600 hover:bg-blue-700 text-white px-3 rounded text-sm"
            >
              Send
            </button>
          </form>
        </div>
      )}
    </>
  )
}

export default AIAssistant