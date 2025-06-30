import './index.css';
import { createRoot } from 'react-dom/client';
import App from "./App";
import { ClerkProvider } from '@clerk/clerk-react';

const clerkPubKey = import.meta.env.VITE_CLERK_PUBLISHABLE_KEY;

// Debug: Check if the environment variable is loaded
console.log('Clerk Publishable Key:', clerkPubKey);
console.log('All env vars:', import.meta.env);

if (!clerkPubKey) {
  console.error('❌ VITE_CLERK_PUBLISHABLE_KEY is missing!');
  console.error('Please check your .env file in the AI-Powered-Calendar-Planner directory');
  
  // Show a helpful error message on the page
  const container = document.getElementById('root');
  if (container) {
    container.innerHTML = `
      <div style="padding: 20px; font-family: Arial, sans-serif; max-width: 600px; margin: 50px auto;">
        <h1 style="color: #e53e3e;">🚨 Environment Variable Missing</h1>
        <p><strong>Error:</strong> VITE_CLERK_PUBLISHABLE_KEY is not set</p>
        <p>To fix this:</p>
        <ol>
          <li>Create a <code>.env</code> file in the <code>AI-Powered-Calendar-Planner</code> directory</li>
          <li>Add your Clerk publishable key: <code>VITE_CLERK_PUBLISHABLE_KEY=pk_test_your_key_here</code></li>
          <li>Get your key from <a href="https://dashboard.clerk.com/" target="_blank">Clerk Dashboard</a> → API Keys</li>
          <li>Restart the development server</li>
        </ol>
        <p><strong>Current directory:</strong> ${window.location.href}</p>
      </div>
    `;
  }
  throw new Error('Missing VITE_CLERK_PUBLISHABLE_KEY');
}

const container = document.getElementById('root');
if (!container) throw new Error('Failed to find the root element');
const root = createRoot(container);
root.render(
  <ClerkProvider publishableKey={clerkPubKey}>
    <App />
  </ClerkProvider>
);