/// <reference types="vite/client" />
import { GoogleGenerativeAI } from "@google/generative-ai";
import { calendarService } from './supabase';

const API_KEY = import.meta.env.VITE_GEMINI_API_KEY as string;

const genAI = new GoogleGenerativeAI(API_KEY);

export async function askGemini(prompt: string, userId: string): Promise<string> {
  try {
    if (!API_KEY) {
      throw new Error('Gemini API key is not configured. Please check your .env file.');
    }

    // Fetch calendar events for the user
    let eventsSummary = '';
    try {
      const events = await calendarService.getEvents(userId);
      if (events.length > 0) {
        eventsSummary = 'Here are your current calendar events:';
        for (const event of events) {
          eventsSummary += `\n- ${event.title} (${event.start_time} to ${event.end_time})${event.location ? ' at ' + event.location : ''}${event.description ? ': ' + event.description : ''}`;
        }
      } else {
        eventsSummary = 'You have no calendar events.';
      }
    } catch (fetchError) {
      eventsSummary = 'Unable to fetch your calendar events at this time.';
    }

    const systemPrompt = `\nYou are an AI scheduling assistant. Only answer questions related to scheduling, calendar events, meetings, reminders, and time management. \nIf a user asks something unrelated, politely tell them you can only help with scheduling and calendar tasks.`;

    const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash-latest" });
    const result = await model.generateContent(eventsSummary + '\n' + systemPrompt + '\n' + prompt);
    const response = await result.response;
    return response.text();
  } catch (error) {
    console.error('Gemini API Error:', error);
    throw error;
  }
} 