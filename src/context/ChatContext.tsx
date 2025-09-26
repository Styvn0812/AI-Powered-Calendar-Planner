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
    text: "Hello! I'm your AI calendar assistant. I can help you add, view, and manage events. How can I help you today?",
    sender: 'ai',
    timestamp: new Date()
  }]);
  const [isLoading, setIsLoading] = useState(false);
  const { addEvent, events, getEventsForDate } = useCalendar();

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
      // Check if user wants to add an event
      if (text.toLowerCase().includes('add') && text.toLowerCase().includes('event')) {
        // Simple event parsing - look for date and title
        const dateMatch = text.match(/(\w+ \d{1,2},? \d{4})/i);
        const timeMatch = text.match(/(\d{1,2}:\d{2}|\d{1,2}\s*(am|pm))/i);
        
        if (dateMatch) {
          const eventDate = new Date(dateMatch[1]);
          const eventTitle = text.replace(/add\s+event\s+/i, '').replace(/\s+on\s+.*$/i, '').trim();
          
          if (!isNaN(eventDate.getTime())) {
            await addEvent({
              title: eventTitle || 'New Event',
              date: eventDate,
              time: timeMatch ? timeMatch[0] : '',
              description: '',
              color: 'bg-blue-500'
            });
            
            const aiMessage: ChatMessage = {
              id: (Date.now() + 1).toString(),
              text: `✅ Event "${eventTitle || 'New Event'}" added to ${eventDate.toDateString()}${timeMatch ? ` at ${timeMatch[0]}` : ''}!`,
              sender: 'ai',
              timestamp: new Date()
            };
            setMessages(prev => [...prev, aiMessage]);
            return;
          }
        }
      }
      
      // For other messages, use Gemini
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