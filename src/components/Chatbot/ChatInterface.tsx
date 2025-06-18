import React, { useEffect, useState, useRef } from 'react';
import { SendIcon } from 'lucide-react';
import { useChat } from '../../context/ChatContext';
import { ChatMessage } from './ChatMessage';
export const ChatInterface = () => {
  const {
    messages,
    sendMessage,
    isLoading
  } = useChat();
  const [input, setInput] = useState('');
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const handleSend = () => {
    if (input.trim() && !isLoading) {
      sendMessage(input);
      setInput('');
    }
  };
  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };
  // Scroll to bottom when messages change
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({
      behavior: 'smooth'
    });
  }, [messages]);
  return <div className="flex flex-col h-full">
      <div className="p-6 border-b border-gray-200">
        <h2 className="text-2xl font-bold text-gray-800">
          AI Calendar Assistant
        </h2>
        <p className="text-gray-600">
          Ask me about your schedule or for help managing events
        </p>
      </div>
      <div className="flex-1 p-4 overflow-y-auto bg-gray-50">
        <div className="max-w-3xl mx-auto space-y-4">
          {messages.map(message => <ChatMessage key={message.id} message={message} />)}
          <div ref={messagesEndRef} />
          {isLoading && <div className="flex items-center space-x-2 text-gray-500">
              <div className="w-2 h-2 rounded-full bg-gray-400 animate-bounce" style={{
            animationDelay: '0ms'
          }} />
              <div className="w-2 h-2 rounded-full bg-gray-400 animate-bounce" style={{
            animationDelay: '150ms'
          }} />
              <div className="w-2 h-2 rounded-full bg-gray-400 animate-bounce" style={{
            animationDelay: '300ms'
          }} />
            </div>}
        </div>
      </div>
      <div className="p-4 border-t border-gray-200 bg-white">
        <div className="max-w-3xl mx-auto flex">
          <textarea value={input} onChange={e => setInput(e.target.value)} onKeyPress={handleKeyPress} placeholder="Ask about your calendar or schedule..." className="flex-1 px-4 py-2 border border-gray-300 rounded-l-md focus:outline-none focus:ring-2 focus:ring-blue-500 resize-none" rows={1} disabled={isLoading} />
          <button onClick={handleSend} disabled={!input.trim() || isLoading} className={`px-4 py-2 rounded-r-md flex items-center justify-center ${!input.trim() || isLoading ? 'bg-gray-300 text-gray-500 cursor-not-allowed' : 'bg-blue-500 text-white hover:bg-blue-600'}`}>
            <SendIcon className="w-5 h-5" />
          </button>
        </div>
      </div>
    </div>;
};