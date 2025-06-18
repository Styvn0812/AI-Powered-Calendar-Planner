// Simple mock AI chat responses related to calendar functionality
const responses = [{
  keywords: ['hello', 'hi', 'hey'],
  responses: ['Hello! How can I assist with your calendar today?', 'Hi there! Need help scheduling something?', "Hey! I'm here to help manage your calendar. What do you need?"]
}, {
  keywords: ['schedule', 'create', 'add', 'event', 'meeting', 'appointment'],
  responses: ["I can help you add that to your calendar. What's the date and time?", 'Sure, I can schedule that for you. When would you like it to happen?', "I'll add that event. Could you provide more details about when it should occur?"]
}, {
  keywords: ['delete', 'remove', 'cancel'],
  responses: ['I can help you remove that from your calendar. Which event would you like to delete?', "Sure, I'll help you cancel that. Could you specify which event?", 'I can remove events from your calendar. Which one should I delete?']
}, {
  keywords: ['today', 'agenda', 'schedule for today'],
  responses: ['Let me check what you have scheduled for today.', "Looking at today's calendar, you have a few events scheduled.", "Here's what your day looks like according to your calendar."]
}, {
  keywords: ['tomorrow', 'upcoming'],
  responses: ['Let me check your upcoming events for you.', 'I see you have some events coming up soon.', "Here's what's on your calendar for the next few days."]
}, {
  keywords: ['remind', 'reminder', 'notification'],
  responses: ['I can set a reminder for that. When would you like to be reminded?', "Sure, I'll add a reminder to your calendar. How much advance notice would you like?", "I'll make sure you get a notification for that event."]
}];
const fallbackResponses = ["I'm not sure I understand. Could you rephrase that?", "I'm here to help with your calendar. What would you like to do?", 'I can help schedule, modify, or cancel events. What do you need?', "I'm your calendar assistant. Would you like to view, add, or modify events?", "I didn't quite catch that. Do you need help with scheduling?"];
export function processMessage(message: string): string {
  const lowerMessage = message.toLowerCase();
  // Find matching response category
  for (const category of responses) {
    for (const keyword of category.keywords) {
      if (lowerMessage.includes(keyword)) {
        // Return random response from matching category
        const randomIndex = Math.floor(Math.random() * category.responses.length);
        return category.responses[randomIndex];
      }
    }
  }
  // Return fallback response if no keywords matched
  const randomIndex = Math.floor(Math.random() * fallbackResponses.length);
  return fallbackResponses[randomIndex];
}