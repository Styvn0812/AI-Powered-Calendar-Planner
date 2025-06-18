import { google } from 'googleapis';
import { authenticate } from '@google-cloud/local-auth';
import path from 'path';

const SCOPES = ['https://www.googleapis.com/auth/calendar'];

export interface GoogleCalendarEvent {
  id: string;
  summary: string;
  description?: string;
  start: {
    dateTime?: string;
    date?: string;
  };
  end: {
    dateTime?: string;
    date?: string;
  };
  colorId?: string;
}

class GoogleCalendarService {
  private auth: any;
  private calendar: any;

  async initialize() {
    try {
      this.auth = await authenticate({
        keyfilePath: path.join(process.cwd(), 'credentials.json'),
        scopes: SCOPES,
      });

      this.calendar = google.calendar({ version: 'v3', auth: this.auth });
    } catch (error) {
      console.error('Error initializing Google Calendar:', error);
      throw error;
    }
  }

  async listEvents(timeMin: string, timeMax: string) {
    try {
      const response = await this.calendar.events.list({
        calendarId: 'primary',
        timeMin,
        timeMax,
        singleEvents: true,
        orderBy: 'startTime',
      });

      return response.data.items;
    } catch (error) {
      console.error('Error listing events:', error);
      throw error;
    }
  }

  async createEvent(event: Omit<GoogleCalendarEvent, 'id'>) {
    try {
      const response = await this.calendar.events.insert({
        calendarId: 'primary',
        requestBody: event,
      });

      return response.data;
    } catch (error) {
      console.error('Error creating event:', error);
      throw error;
    }
  }

  async updateEvent(eventId: string, event: Partial<GoogleCalendarEvent>) {
    try {
      const response = await this.calendar.events.update({
        calendarId: 'primary',
        eventId,
        requestBody: event,
      });

      return response.data;
    } catch (error) {
      console.error('Error updating event:', error);
      throw error;
    }
  }

  async deleteEvent(eventId: string) {
    try {
      await this.calendar.events.delete({
        calendarId: 'primary',
        eventId,
      });
    } catch (error) {
      console.error('Error deleting event:', error);
      throw error;
    }
  }
}

export const googleCalendarService = new GoogleCalendarService(); 