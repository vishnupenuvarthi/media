import { Router } from 'express';
import { authenticate } from '../middleware/auth.js';
import {
  createEvent,
  deleteEvent,
  listEvents,
  updateEvent,
  validateCalendarBody,
  validateCalendarDelete,
  validateCalendarQuery,
  validateCalendarUpdate
} from '../controllers/calendar.controller.js';

export const calendarRouter = Router();

calendarRouter.get('/events', validateCalendarQuery, listEvents);
calendarRouter.post('/events', authenticate, validateCalendarBody, createEvent);
calendarRouter.put('/events/:id', authenticate, validateCalendarUpdate, updateEvent);
calendarRouter.delete('/events/:id', authenticate, validateCalendarDelete, deleteEvent);

