import React, { useState, createContext, useContext, ReactNode } from 'react';
import { askGemini } from '../services/gemini';
// @ts-ignore
import chrono from 'chrono-node';
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
  const { addEvent } = useCalendar();

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

      // --- Robust parsing with chrono-node ---
      // Example: "Okay, I have scheduled Lunch with Sarah next Friday at noon."
      const scheduleMatch = response.match(/scheduled (.+?)(?: on| for| at|$)/i);
      if (scheduleMatch) {
        const title = scheduleMatch[1].trim();
        // Use chrono-node to parse date/time from the response
        const parsed = chrono.parse(response);
        if (parsed.length > 0) {
          const date = parsed[0].start.date();
          let time = '';
          if (parsed[0].start.isCertain('hour')) {
            const hour = parsed[0].start.get('hour');
            const minute = parsed[0].start.get('minute') || 0;
            time = `${hour.toString().padStart(2, '0')}:${minute.toString().padStart(2, '0')}`;
          }
          addEvent({
            title,
            date,
            time,
            description: '', // You can extract more if you want
            color: 'bg-blue-500'
          });
        }
      }
      // --- End robust parsing ---

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