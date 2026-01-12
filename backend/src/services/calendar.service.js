import { CalendarEventModel } from '../models/calendarEvent.model.js';

const buildDateRange = ({ year, month }) => {
  const y = Number(year);
  if (Number.isNaN(y)) {
    return null;
  }
  const start = new Date(Date.UTC(y, month ? Number(month) - 1 : 0, 1));
  const end = month
    ? new Date(Date.UTC(y, Number(month), 1))
    : new Date(Date.UTC(y + 1, 0, 1));
  return { start, end };
};

export const CalendarService = {
  listEvents: async ({ year, month }) => {
    try {
      let filter = {};
      
      // If year is provided, filter by date range
      if (year) {
        const range = buildDateRange({ year, month });
        if (!range) {
          throw new Error('Invalid year provided');
        }
        filter = { date: { $gte: range.start, $lt: range.end } };
      }
      // If no year provided, return all events (useful for PDFs)
      
      const events = await CalendarEventModel.find(filter).sort({ date: -1 }).lean();
      return events;
    } catch (error) {
      console.error('Error in CalendarService.listEvents:', error.message);
      return [];
    }
  },

  createEvent: async (payload) => CalendarEventModel.create(payload),

  updateEvent: async (id, payload) =>
    CalendarEventModel.findByIdAndUpdate(id, payload, { new: true }),

  deleteEvent: async (id) => CalendarEventModel.findByIdAndDelete(id)
};

