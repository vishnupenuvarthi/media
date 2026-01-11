import { body, param, query } from 'express-validator';
import path from 'path';
import { fileURLToPath } from 'url';
import { asyncHandler } from '../utils/asyncHandler.js';
import { CalendarService } from '../services/calendar.service.js';
import { AppError } from '../utils/AppError.js';
import { validateRequest } from '../middleware/validateRequest.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

export const validateCalendarQuery = [
  query('year').isInt({ min: 1900 }).withMessage('Year is required'),
  query('month').optional().isInt({ min: 1, max: 12 }),
  validateRequest
];

const categoryOptions = ['national', 'business', 'sports', 'culture', 'breaking', 'custom'];

export const validateCalendarBody = [
  body('title').notEmpty(),
  body('date').isISO8601().toDate(),
  body('category').optional().isIn(categoryOptions),
  validateRequest
];

export const validateCalendarUpdate = [
  param('id').isMongoId(),
  body('title').optional().notEmpty(),
  body('date').optional().isISO8601().toDate(),
  body('category').optional().isIn(categoryOptions),
  validateRequest
];

export const validateCalendarDelete = [param('id').isMongoId(), validateRequest];

export const listEvents = asyncHandler(async (req, res) => {
  const { year, month } = req.query;
  const events = await CalendarService.listEvents({ year, month });
  res.json(
    events.map((event) => ({
      id: event._id.toString(),
      title: event.title,
      description: event.description,
      date: event.date,
      category: event.category,
      location: event.location,
      tags: event.tags ?? []
    }))
  );
});

export const createEvent = asyncHandler(async (req, res) => {
  const payload = {
    ...req.body,
    createdBy: req.user?.userId
  };
  const event = await CalendarService.createEvent(payload);
  res.status(201).json({
    id: event._id.toString(),
    title: event.title,
    description: event.description,
    date: event.date,
    category: event.category,
    location: event.location,
    tags: event.tags ?? []
  });
});

export const updateEvent = asyncHandler(async (req, res) => {
  const updated = await CalendarService.updateEvent(req.params.id, req.body);
  if (!updated) throw new AppError('Event not found', 404);
  res.json({
    id: updated._id.toString(),
    title: updated.title,
    description: updated.description,
    date: updated.date,
    category: updated.category,
    location: updated.location,
    tags: updated.tags ?? []
  });
});

export const deleteEvent = asyncHandler(async (req, res) => {
  const deleted = await CalendarService.deleteEvent(req.params.id);
  if (!deleted) throw new AppError('Event not found', 404);
  res.status(204).send();
});

export const uploadPDF = asyncHandler(async (req, res) => {
  const { title, description, date, location, category, tags } = req.body;

  if (!req.file) {
    throw new AppError('No PDF file provided', 400);
  }

  if (req.file.mimetype !== 'application/pdf') {
    throw new AppError('Only PDF files are allowed', 400);
  }

  const payload = {
    title,
    description,
    date: date || new Date(),
    location,
    category: category || 'pdf',
    tags: tags ? (Array.isArray(tags) ? tags : [tags]) : [],
    isPdfEvent: true,
    pdfFileName: req.file.originalname,
    pdfSize: req.file.size,
    pdfUploadedAt: new Date(),
    createdBy: req.user?.userId
  };

  const event = await CalendarService.createEvent(payload);

  res.status(201).json({
    id: event._id.toString(),
    ...payload
  });
});

export const getNLRCalendarPdf = asyncHandler(async (req, res) => {
  const pdfPath = path.join(__dirname, '../nlr-calendar-2026.pdf');
  console.log('Serving PDF from:', pdfPath);

  import('fs').then((fs) => {
    if (!fs.existsSync(pdfPath)) {
      console.error('PDF FILE NOT FOUND AT:', pdfPath);
      // Try listing the directory to see what IS there
      const dir = path.join(__dirname, '../');
      console.log('listing contents of:', dir);
      console.log(fs.readdirSync(dir));
      return res.status(404).json({ message: 'PDF file missing on server' });
    }

    res.sendFile(pdfPath, (err) => {
      if (err) {
        console.error('Error serving PDF:', err);
        if (!res.headersSent) {
          res.status(404).json({ message: 'Error serving PDF file' });
        }
      }
    });
  });
});


