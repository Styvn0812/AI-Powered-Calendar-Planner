import React from 'react';
import { format } from 'date-fns';
import { UserIcon, BotIcon } from 'lucide-react';
import { ChatMessage as ChatMessageType } from '../../context/ChatContext';
interface ChatMessageProps {
  message: ChatMessageType;
}
export const ChatMessage = ({
  message
}: ChatMessageProps) => {
  const isUser = message.sender === 'user';
  return <div className={`flex ${isUser ? 'justify-end' : 'justify-start'}`}>
      <div className={`flex max-w-[80%] ${isUser ? 'flex-row-reverse' : 'flex-row'}`}>
        <div className={`flex-shrink-0 flex items-start pt-1 ${isUser ? 'ml-2' : 'mr-2'}`}>
          <div className={`w-8 h-8 rounded-full flex items-center justify-center ${isUser ? 'bg-blue-100 text-blue-600' : 'bg-purple-100 text-purple-600'}`}>
            {isUser ? <UserIcon className="w-4 h-4" /> : <BotIcon className="w-4 h-4" />}
          </div>
        </div>
        <div className={`rounded-lg px-4 py-2 ${isUser ? 'bg-blue-500 text-white' : 'bg-white border border-gray-200'}`}>
          <div className="text-sm">{message.text}</div>
          <div className={`text-xs mt-1 ${isUser ? 'text-blue-100' : 'text-gray-400'}`}>
            {format(new Date(message.timestamp), 'h:mm a')}
          </div>
        </div>
      </div>
    </div>;
};