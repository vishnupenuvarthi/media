import { Router } from 'express';
import { authenticate } from '../middleware/auth.js';
import {
  createEvent,
  deleteEvent,
  listEvents,
  updateEvent,
  uploadPDF,
  validateCalendarBody,
  validateCalendarDelete,
  validateCalendarQuery,
  validateCalendarUpdate,
  getNLRCalendarPdf
} from '../controllers/calendar.controller.js';

export const calendarRouter = Router();

calendarRouter.get('/nlr-news-calendar-2026.pdf', getNLRCalendarPdf); // Keep for legacy
calendarRouter.get('/download-pdf', getNLRCalendarPdf); // New simple route

// Note: For PDF upload, you'll need to add multer middleware
// For now, this is set up for basic file handling
calendarRouter.get('/events', validateCalendarQuery, listEvents);
calendarRouter.post('/events', authenticate, validateCalendarBody, createEvent);
calendarRouter.post('/events/pdf-upload', authenticate, uploadPDF);
calendarRouter.put('/events/:id', authenticate, validateCalendarUpdate, updateEvent);
calendarRouter.delete('/events/:id', authenticate, validateCalendarDelete, deleteEvent);


