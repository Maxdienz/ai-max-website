import { useState, useEffect, useRef } from 'react';
import io from 'socket.io-client';

// Thay bằng domain backend sau khi deploy
const socket = io('https://your-backend-railway-domain.up.railway.app');

export default function Home() {
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState('');
  const [username, setUsername] = useState('');
  const [isSetup, setIsSetup] = useState(false);
  const messagesEndRef = useRef(null);

  useEffect(() => {
    socket.on('message', (data) => {
      setMessages(prev => [...prev, { text: data, sender: 'ai' }]);
    });

    socket.on('user_info_set', (data) => {
      alert(`Chào mừng ${data.name}!`);
      setIsSetup(true);
    });

    return () => {
      socket.off('message');
      socket.off('user_info_set');
    };
  }, []);

  const handleSetUser = () => {
    if (username.trim()) {
      socket.emit('set_user_info', { name: username });
    }
  };

  const sendMessage = () => {
    if (!input.trim()) return;

    socket.emit('message', input);
    setMessages(prev => [...prev, { text: input, sender: 'user' }]);
    setInput('');
  };

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  if (!isSetup) {
    return (
      <div
        style={{
          padding: '20px',
          fontFamily: "'Segoe UI', Tahoma, Geneva, Verdana, sans-serif",
          background: 'linear-gradient(135deg, #f5c2e7, #e0bbf8, #d4b4f3)',
          minHeight: '100vh',
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'center',
          alignItems: 'center',
        }}
      >
        <h1 style={{ color: '#ff1493', fontSize: '2.5rem', fontWeight: 'bold' }}>AI-MAX 💋</h1>
        <p style={{ color: '#c71585', marginBottom: '20px' }}>Vui lòng nhập tên của bạn:</p>
        <input
          type="text"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
          placeholder="Tên bạn là gì?"
          style={{
            padding: '10px',
            fontSize: '16px',
            borderRadius: '30px',
            border: '2px solid #ff69b4',
            outline: 'none',
            width: '300px',
            textAlign: 'center',
          }}
        />
        <button
          onClick={handleSetUser}
          style={{
            marginTop: '20px',
            padding: '12px 30px',
            backgroundColor: '#ff69b4',
            color: 'white',
            border: 'none',
            borderRadius: '30px',
            cursor: 'pointer',
            fontWeight: 'bold',
          }}
        >
          Bắt đầu chat
        </button>
      </div>
    );
  }

  return (
    <div
      style={{
        padding: '20px',
        fontFamily: "'Segoe UI', Tahoma, Geneva, Verdana, sans-serif",
        background: 'linear-gradient(135deg, #f5c2e7, #e0bbf8, #d4b4f3)',
        minHeight: '100vh',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
      }}
    >
      <header
        style={{
          textAlign: 'center',
          marginBottom: '20px',
          width: '100%',
        }}
      >
        <h1
          style={{
            color: '#ff1493',
            fontSize: '2.5rem',
            fontWeight: 'bold',
            textShadow: '2px 2px 4px rgba(0,0,0,0.1)',
            letterSpacing: '2px',
          }}
        >
          💋 AI-MAX 💋
        </h1>
        <p style={{ color: '#c71585', fontStyle: 'italic' }}>Welcome back, {username}! 💖</p>
      </header>

      <div
        style={{
          width: '90%',
          maxWidth: '800px',
          height: '70vh',
          overflowY: 'auto',
          border: '2px solid #ff69b4',
          borderRadius: '20px',
          padding: '15px',
          backgroundColor: 'rgba(255, 255, 255, 0.85)',
          boxShadow: '0 8px 20px rgba(255, 105, 180, 0.3)',
          marginBottom: '20px',
        }}
      >
        {messages.map((msg, i) => (
          <div
            key={i}
            style={{
              textAlign: msg.sender === 'user' ? 'right' : 'left',
              margin: '15px 0',
              padding: '12px 18px',
              borderRadius: '20px',
              display: 'inline-block',
              maxWidth: '80%',
              wordWrap: 'break-word',
              backgroundColor: msg.sender === 'user' 
                ? '#ffb6c1' 
                : '#ffebee',
              color: '#8b0000',
              boxShadow: '0 2px 6px rgba(0,0,0,0.1)',
              position: 'relative',
            }}
          >
            <span style={{ fontWeight: '500' }}>
              {msg.text}
            </span>
            {msg.sender === 'ai' && (
              <span
                style={{
                  position: 'absolute',
                  bottom: '-15px',
                  right: '10px',
                  fontSize: '0.8rem',
                  color: '#ff69b4',
                }}
              >
                💋
              </span>
            )}
          </div>
        ))}
        <div ref={messagesEndRef} />
      </div>

      <div
        style={{
          display: 'flex',
          width: '90%',
          maxWidth: '800px',
          gap: '10px',
        }}
      >
        <input
          type="text"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyPress={(e) => e.key === 'Enter' && sendMessage()}
          placeholder="Gửi tin nhắn cho AI-MAX..."
          style={{
            flex: 1,
            padding: '15px',
            fontSize: '16px',
            borderRadius: '30px',
            border: '2px solid #ff69b4',
            outline: 'none',
            backgroundColor: 'rgba(255, 255, 255, 0.9)',
            boxShadow: '0 4px 8px rgba(255, 105, 180, 0.2)',
          }}
        />
        <button
          onClick={sendMessage}
          style={{
            padding: '15px 30px',
            backgroundColor: '#ff69b4',
            color: 'white',
            border: 'none',
            borderRadius: '30px',
            cursor: 'pointer',
            fontWeight: 'bold',
            fontSize: '16px',
            boxShadow: '0 4px 10px rgba(255, 105, 180, 0.4)',
            transition: 'all 0.2s ease',
          }}
          onMouseOver={(e) => {
            e.target.style.transform = 'scale(1.05)';
            e.target.style.backgroundColor = '#ff1493';
          }}
          onMouseOut={(e) => {
            e.target.style.transform = 'scale(1)';
            e.target.style.backgroundColor = '#ff69b4';
          }}
        >
          💋 Gửi
        </button>
      </div>
    </div>
  );
}
