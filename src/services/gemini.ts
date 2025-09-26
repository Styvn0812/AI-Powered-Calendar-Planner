/// <reference types="vite/client" />
import { GoogleGenerativeAI } from "@google/generative-ai";

const API_KEY = import.meta.env.VITE_GEMINI_API_KEY as string;

const genAI = new GoogleGenerativeAI(API_KEY);

export async function askGemini(prompt: string): Promise<string> {
  try {
    if (!API_KEY) {
      throw new Error('Gemini API key is not configured. Please check your .env file.');
    }
    
    console.log('API Key loaded:', API_KEY ? 'Yes' : 'No');
    console.log('API Key length:', API_KEY?.length);
    console.log('Using model: gemini-2.5-flash');
    
    const systemPrompt = `You are an AI scheduling assistant. Only answer questions related to scheduling, calendar events, meetings, reminders, and time management. 
If a user asks something unrelated, politely tell them you can only help with scheduling and calendar tasks.`;

    // Try the newer gemini-2.5-flash model
    const model = genAI.getGenerativeModel({ model: "gemini-2.5-flash" });
    
    // Simple approach without chat history
    const fullPrompt = `${systemPrompt}\n\nUser: ${prompt}`;
    const result = await model.generateContent(fullPrompt);
    const response = await result.response;
    return response.text();
  } catch (error) {
    console.error('Gemini API Error:', error);
    console.error('Error details:', error);
    
    // Check if it's a quota exceeded error
    if (error instanceof Error && error.message.includes('quota')) {
      return "I'm currently experiencing high demand and my API quota has been exceeded. Please try again in a few minutes, or contact support if this persists. In the meantime, I can still help you with basic calendar questions!";
    }
    
    // For other errors, provide a helpful fallback
    return "I'm having trouble connecting to my AI service right now. Please try again in a moment, or feel free to ask me about your calendar and I'll do my best to help!";
  }
} 