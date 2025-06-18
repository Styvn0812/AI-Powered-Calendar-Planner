import React, { useState, createContext, useContext, ReactNode } from 'react';
import { askGemini } from '../services/gemini';
export interface ChatMessage {
  id: string;
  text: string;
  sender: 'user' | 'ai';
  timestamp: Date;
}
interface ChatContextType {
  messages: ChatMessage[];
  sendMessage: (message: string) => Promise<void>;
  isLoading: boolean;
}
const ChatContext = createContext<ChatContextType | undefined>(undefined);
export const ChatProvider: React.FC<{
  children: ReactNode;
}> = ({
  children
}) => {
  const [messages, setMessages] = useState<ChatMessage[]>([{
    id: '1',
    text: "Hello! I'm your AI calendar assistant. How can I help you today?",
    sender: 'ai',
    timestamp: new Date()
  }]);
  const [isLoading, setIsLoading] = useState(false);
  const sendMessage = async (text: string) => {
    // Add user message
    const userMessage: ChatMessage = {
      id: Date.now().toString(),
      text,
      sender: 'user',
      timestamp: new Date()
    };
    setMessages(prev => [...prev, userMessage]);
    setIsLoading(true);
    try {
      const response = await askGemini(text);
      const aiMessage: ChatMessage = {
        id: (Date.now() + 1).toString(),
        text: response,
        sender: 'ai',
        timestamp: new Date()
      };
      setMessages(prev => [...prev, aiMessage]);
    } catch (error) {
      const aiMessage: ChatMessage = {
        id: (Date.now() + 1).toString(),
        text: 'Sorry, there was an error getting a response from Gemini.',
        sender: 'ai',
        timestamp: new Date()
      };
      setMessages(prev => [...prev, aiMessage]);
    } finally {
      setIsLoading(false);
    }
  };
  return <ChatContext.Provider value={{
    messages,
    sendMessage,
    isLoading
  }}>
      {children}
    </ChatContext.Provider>;
};
export const useChat = () => {
  const context = useContext(ChatContext);
  if (context === undefined) {
    throw new Error('useChat must be used within a ChatProvider');
  }
  return context;
};