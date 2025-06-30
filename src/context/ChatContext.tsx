import React, { useState, createContext, useContext, ReactNode } from 'react';
import { askGemini } from '../services/gemini';
import { useCalendar } from './CalendarContext';

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
  const { events } = useCalendar();

  const formatEventsForAI = () => {
    if (!events || events.length === 0) return 'You have no events.';
    return events.map(e => {
      let line = `- ${e.title} on ${e.dateString}`;
      if (e.time) line += ` at ${e.time}`;
      if (e.description) line += ` (${e.description})`;
      return line;
    }).join('\n');
  };

  const sendMessage = async (text: string) => {
    const userMessage: ChatMessage = {
      id: Date.now().toString(),
      text,
      sender: 'user',
      timestamp: new Date()
    };
    setMessages(prev => [...prev, userMessage]);
    setIsLoading(true);
    try {
      const eventsSummary = formatEventsForAI();
      const promptWithEvents = `Here are the user's calendar events:\n${eventsSummary}\n\nUser's question: ${text}`;
      const response = await askGemini(promptWithEvents);
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