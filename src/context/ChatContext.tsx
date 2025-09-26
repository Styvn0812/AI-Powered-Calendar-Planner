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
        // Enhanced event parsing - look for date and title
        const dateMatch = text.match(/(\w+ \d{1,2},? \d{4})/i);
        const timeMatch = text.match(/(\d{1,2}:\d{2}\s*(am|pm)|\d{1,2}\s*(am|pm))/i);
        
        if (dateMatch) {
          let eventDate = new Date(dateMatch[1]);
          const eventTitle = text.replace(/add\s+event\s+/i, '').replace(/\s+on\s+.*$/i, '').trim();
          
          // Parse and set the time if provided
          if (timeMatch) {
            const timeStr = timeMatch[0].trim();
            let hours = 0;
            let minutes = 0;
            
            console.log('Time string found:', timeStr);
            
            if (timeStr.includes(':')) {
              // Format: "2:30pm" or "14:30"
              const [h, m] = timeStr.split(':');
              hours = parseInt(h);
              minutes = parseInt(m.replace(/\D/g, ''));
              
              // Handle AM/PM
              if (timeStr.toLowerCase().includes('pm') && hours !== 12) {
                hours += 12;
              } else if (timeStr.toLowerCase().includes('am') && hours === 12) {
                hours = 0;
              }
            } else {
              // Format: "2pm" or "14"
              hours = parseInt(timeStr.replace(/\D/g, ''));
              if (timeStr.toLowerCase().includes('pm') && hours !== 12) {
                hours += 12;
              } else if (timeStr.toLowerCase().includes('am') && hours === 12) {
                hours = 0;
              }
            }
            
            console.log('Parsed time:', { timeStr, hours, minutes, isPM: timeStr.toLowerCase().includes('pm') });
            
            // Set the time on the date
            eventDate.setHours(hours, minutes, 0, 0);
            console.log('Final event date:', eventDate);
          }
          
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