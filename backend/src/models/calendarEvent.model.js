import { Schema, model } from 'mongoose';

const CalendarEventSchema = new Schema(
  {
    title: { type: String, required: true, trim: true },
    description: { type: String, default: '' },
    date: { type: Date, required: true },
    category: {
      type: String,
      enum: ['national', 'business', 'sports', 'culture', 'breaking', 'custom'],
      default: 'custom'
    },
    location: { type: String, default: '' },
    tags: [{ type: String }],
    createdBy: { type: Schema.Types.ObjectId, ref: 'User' }
  },
  { timestamps: true }
);

CalendarEventSchema.index({ date: 1 });

export const CalendarEventModel = model('CalendarEvent', CalendarEventSchema);

