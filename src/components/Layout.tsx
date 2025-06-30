import React from 'react';
import { UserButton } from '@clerk/clerk-react';
import { Calendar } from './Calendar/Calendar';
import { ChatInterface } from './Chatbot/ChatInterface';

export const Layout = () => {
  return (
    <div className="flex flex-col h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white border-b border-gray-200 py-4 px-6 flex justify-between items-center">
        <h1 className="text-xl font-bold text-gray-800">AI Calendar Planner</h1>
        <UserButton />
      </header>

      {/* Main Content */}
      <main className="flex-1 overflow-hidden flex">
        {/* Calendar Section - Takes up 2/3 of the space */}
        <div className="w-2/3 h-full border-r border-gray-200">
          <Calendar />
        </div>

        {/* Chat Section - Takes up 1/3 of the space */}
        <div className="w-1/3 h-full">
          <ChatInterface />
        </div>
      </main>
    </div>
  );
};