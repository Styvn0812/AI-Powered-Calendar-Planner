import React, { useState } from 'react';
import { Calendar } from './Calendar/Calendar';
import { ChatInterface } from './Chatbot/ChatInterface';
import { CalendarIcon, MessageSquareIcon } from 'lucide-react';
export const Layout = () => {
  const [activeTab, setActiveTab] = useState<'calendar' | 'chat'>('calendar');
  return <div className="flex flex-col h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white border-b border-gray-200 py-4 px-6 flex justify-between items-center">
        <h1 className="text-xl font-bold text-gray-800">AI Calendar Planner</h1>
        <div className="flex space-x-2">
          <button onClick={() => setActiveTab('calendar')} className={`px-3 py-2 rounded-md flex items-center ${activeTab === 'calendar' ? 'bg-blue-100 text-blue-700' : 'text-gray-600 hover:bg-gray-100'}`}>
            <CalendarIcon className="w-5 h-5 mr-2" />
            Calendar
          </button>
          <button onClick={() => setActiveTab('chat')} className={`px-3 py-2 rounded-md flex items-center ${activeTab === 'chat' ? 'bg-blue-100 text-blue-700' : 'text-gray-600 hover:bg-gray-100'}`}>
            <MessageSquareIcon className="w-5 h-5 mr-2" />
            AI Assistant
          </button>
        </div>
      </header>
      {/* Main Content */}
      <main className="flex-1 overflow-hidden">
        <div className="h-full">
          {activeTab === 'calendar' ? <Calendar /> : <ChatInterface />}
        </div>
      </main>
    </div>;
};