-- Create the calendar_events table (if it doesn't exist)
CREATE TABLE IF NOT EXISTS calendar_events (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id TEXT NOT NULL,
  title TEXT NOT NULL,
  description TEXT,
  start_time TIMESTAMP WITH TIME ZONE NOT NULL,
  end_time TIMESTAMP WITH TIME ZONE NOT NULL,
  location TEXT,
  color TEXT DEFAULT 'bg-blue-500',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- DISABLE Row Level Security for testing
ALTER TABLE calendar_events DISABLE ROW LEVEL SECURITY;

-- Create indexes (if they don't exist)
CREATE INDEX IF NOT EXISTS idx_calendar_events_user_id ON calendar_events(user_id);
CREATE INDEX IF NOT EXISTS idx_calendar_events_start_time ON calendar_events(start_time);

-- Create a function to automatically update the updated_at column (if it doesn't exist)
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ language 'plpgsql';

-- Drop the trigger if it exists, then recreate it
DROP TRIGGER IF EXISTS update_calendar_events_updated_at ON calendar_events;

-- Create a trigger to automatically update the updated_at column
CREATE TRIGGER update_calendar_events_updated_at 
  BEFORE UPDATE ON calendar_events 
  FOR EACH ROW 
  EXECUTE FUNCTION update_updated_at_column(); 