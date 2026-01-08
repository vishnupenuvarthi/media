import { body, param, query } from 'express-validator';
import { asyncHandler } from '../utils/asyncHandler.js';
import { CalendarService } from '../services/calendar.service.js';
import { AppError } from '../utils/AppError.js';
import { validateRequest } from '../middleware/validateRequest.js';

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

