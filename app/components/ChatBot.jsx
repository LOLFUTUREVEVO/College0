'use client';
import { useState } from 'react';

export default function ChatBot() {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);

  async function sendMessage() {
    if (!input.trim()) return;
    const userMsg = { role: 'user', content: input };
    const updated = [...messages, userMsg];
    setMessages(updated);
    setInput('');
    setLoading(true);

    const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/chat`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ messages: updated }),
    });
    const data = await res.json();
    setMessages([...updated, { role: 'assistant', content: data.reply }]);
    setLoading(false);
  }

  return (
    <div style={{ position: 'fixed', bottom: '24px', right: '24px', zIndex: 9999 }}>
      {isOpen && (
        <div style={{
          width: '350px', height: '500px',
          background: '#1e1e2e',
          borderRadius: '16px',
          boxShadow: '0 8px 32px rgba(0,0,0,0.4)',
          marginBottom: '12px',
          display: 'flex',
          flexDirection: 'column',
          overflow: 'hidden',
          border: '1px solid #2e2e3e',
        }}>
          {/* Header */}
          <div style={{
            padding: '16px',
            background: '#0d9488',
            color: 'white',
            fontWeight: 600,
            fontSize: '15px',
            display: 'flex',
            alignItems: 'center',
            gap: '8px',
          }}>
            <span style={{ fontSize: '18px' }}>💬</span> Assistant
          </div>

          {/* Messages */}
          <div style={{
            flex: 1, overflowY: 'auto', padding: '16px',
            display: 'flex', flexDirection: 'column', gap: '10px',
          }}>
            {messages.length === 0 && (
              <div style={{ color: '#6b7280', fontSize: '13px', textAlign: 'center', marginTop: '80px' }}>
                Ask me anything!
              </div>
            )}
            {messages.map((m, i) => (
              <div key={i} style={{
                alignSelf: m.role === 'user' ? 'flex-end' : 'flex-start',
                background: m.role === 'user' ? '#0d9488' : '#2e2e3e',
                color: 'white',
                padding: '10px 14px',
                borderRadius: m.role === 'user' ? '16px 16px 4px 16px' : '16px 16px 16px 4px',
                maxWidth: '80%',
                fontSize: '14px',
                lineHeight: '1.5',
              }}>
                {m.content}
              </div>
            ))}
            {loading && (
              <div style={{
                alignSelf: 'flex-start', color: '#9ca3af',
                fontSize: '13px', padding: '8px 12px',
                background: '#2e2e3e', borderRadius: '16px',
              }}>
                Typing...
              </div>
            )}
          </div>

          {/* Input */}
          <div style={{
            padding: '12px', borderTop: '1px solid #2e2e3e',
            display: 'flex', gap: '8px', background: '#1e1e2e',
          }}>
            <input
              value={input}
              onChange={e => setInput(e.target.value)}
              onKeyDown={e => e.key === 'Enter' && sendMessage()}
              placeholder="Type a message..."
              style={{
                flex: 1, padding: '10px 14px',
                borderRadius: '10px',
                border: '1px solid #3e3e4e',
                background: '#2e2e3e',
                color: 'white',
                outline: 'none',
                fontSize: '14px',
              }}
            />
            <button onClick={sendMessage} style={{
              padding: '10px 16px',
              background: '#0d9488',
              color: 'white',
              border: 'none',
              borderRadius: '10px',
              cursor: 'pointer',
              fontWeight: 600,
              fontSize: '14px',
            }}>
              Send
            </button>
          </div>
        </div>
      )}

      {/* Toggle button */}
      <button onClick={() => setIsOpen(!isOpen)} style={{
        width: '56px', height: '56px',
        borderRadius: '50%',
        background: '#0d9488',
        border: 'none',
        cursor: 'pointer',
        fontSize: '22px',
        float: 'right',
        boxShadow: '0 4px 12px rgba(13,148,136,0.4)',
      }}>
        {isOpen ? '✕' : '💬'}
      </button>
    </div>
  );
}