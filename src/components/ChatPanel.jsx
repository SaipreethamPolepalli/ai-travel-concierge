import React, { useState, useRef, useEffect } from 'react';
import { Send, Compass, User, Sparkles, ArrowRight } from 'lucide-react';

const ChatPanel = ({ messages, onSendMessage, isTyping }) => {
  const [inputValue, setInputValue] = useState('');
  const chatEndRef = useRef(null);
  const textareaRef = useRef(null);

  const suggestions = [
    { label: 'Trip to Tokyo 🇯🇵', text: 'I want to plan an international trip to Tokyo next month. I want to visit museums and eat sushi!' },
    { label: 'Road trip to Austin 🤠', text: 'Help me plan a road trip to Austin, Texas for next weekend. I want to check out live music and eat BBQ.' },
    { label: 'Relaxing Family getaway 🏖️', text: 'I want a weekend getaway with my family to relax and inexpensively. What are some options?' },
    { label: 'Explore Paris 🗼', text: 'I am planning to go to Paris, France for a week. What should I check before going?' },
  ];

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!inputValue.trim()) return;
    onSendMessage(inputValue.trim());
    setInputValue('');
    if (textareaRef.current) {
      textareaRef.current.style.height = 'auto'; // Reset height
    }
  };

  const handleKeyDown = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSubmit(e);
    }
  };

  const handleInputChange = (e) => {
    setInputValue(e.target.value);
    // Auto-grow height as content increases
    e.target.style.height = 'auto';
    e.target.style.height = `${Math.min(e.target.scrollHeight, 150)}px`; // Cap max height at 150px
  };

  const handleSuggestionClick = (text) => {
    onSendMessage(text);
  };

  // Scroll to bottom of chat history when messages or typing status updates
  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, isTyping]);

  return (
    <div className="chat-container glass-panel">
      {/* Agent Header */}
      <div className="chat-header">
        <div className="agent-avatar">
          <Compass size={22} color="#080c14" strokeWidth={2.5} />
        </div>
        <div className="agent-status-info">
          <h3>Aero</h3>
          <div className="agent-status-label">
            <span className="pulse-dot"></span>
            AI Travel Concierge
          </div>
        </div>
      </div>

      {/* Chat History */}
      <div className="chat-history">
        {messages.map((msg, index) => (
          <div
            key={index}
            className={`chat-message ${msg.sender === 'agent' ? 'agent' : 'user'}`}
          >
            <div className="message-bubble">
              {msg.text.split('\n').map((line, lIdx) => (
                <p key={lIdx} style={{ marginBottom: lIdx === msg.text.split('\n').length - 1 ? 0 : '8px' }}>
                  {line}
                </p>
              ))}
            </div>
            <div className="message-meta">
              {msg.sender === 'agent' ? 'Aero' : 'You'} • {msg.time}
            </div>
          </div>
        ))}

        {isTyping && (
          <div className="chat-message agent">
            <div className="message-bubble" style={{ padding: '10px 14px' }}>
              <div className="typing-indicator">
                <span className="typing-dot"></span>
                <span className="typing-dot"></span>
                <span className="typing-dot"></span>
              </div>
            </div>
          </div>
        )}
        <div ref={chatEndRef} />
      </div>

      {/* Suggestions bar */}
      <div className="suggestions-bar">
        {suggestions.map((suggestion, index) => (
          <button
            key={index}
            className="suggestion-btn"
            onClick={() => handleSuggestionClick(suggestion.text)}
          >
            {suggestion.label}
          </button>
        ))}
      </div>

      {/* Chat Input */}
      <form className="chat-input-area" onSubmit={handleSubmit} style={{ alignItems: 'flex-end' }}>
        <textarea
          ref={textareaRef}
          className="chat-input"
          placeholder="Ask Aero to plan, add dates, or check info..."
          value={inputValue}
          onChange={handleInputChange}
          onKeyDown={handleKeyDown}
          disabled={isTyping}
          rows={1}
          style={{
            resize: 'none',
            overflowY: 'auto',
            minHeight: '44px',
            maxHeight: '150px',
            paddingTop: '12px',
            paddingBottom: '12px',
            borderRadius: '16px'
          }}
        />
        <button 
          type="submit" 
          className="send-btn" 
          disabled={isTyping || !inputValue.trim()}
          style={{ flexShrink: 0, marginBottom: '2px' }}
        >
          <Send size={18} />
        </button>
      </form>
    </div>
  );
};

export default ChatPanel;
