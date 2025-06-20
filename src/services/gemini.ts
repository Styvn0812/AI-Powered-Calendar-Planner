/// <reference types="vite/client" />
import { GoogleGenerativeAI } from "@google/generative-ai";

const API_KEY = import.meta.env.VITE_GEMINI_API_KEY as string;

const genAI = new GoogleGenerativeAI(API_KEY);

export async function askGemini(prompt: string): Promise<string> {
  try {
    if (!API_KEY) {
      throw new Error('Gemini API key is not configured. Please check your .env file.');
    }
    
    const systemPrompt = `
      You are an AI scheduling assistant. Only answer questions related to scheduling, calendar events, meetings, reminders, and time management. 
      If a user asks something unrelated, politely tell them you can only help with scheduling and calendar tasks.
    `;

    const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash-latest" });
    const result = await model.generateContent(systemPrompt + '\n' + prompt);
    const response = await result.response;
    return response.text();
  } catch (error) {
    console.error('Gemini API Error:', error);
    throw error;
  }
} 