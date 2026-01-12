import { Schema, model } from 'mongoose';

const CalendarEventSchema = new Schema(
  {
    title: { type: String, required: true, trim: true },
    description: { type: String, default: '' },
    date: { type: Date, required: true },
    category: {
      type: String,
      enum: ['national', 'business', 'sports', 'culture', 'breaking', 'custom', 'pdf'],
      default: 'custom'
    },
    location: { type: String, default: '' },
    tags: [{ type: String }],
    createdBy: { type: Schema.Types.ObjectId, ref: 'User' },
    // PDF Fields
    pdfUrl: { type: String, default: '' },
    pdfFileName: { type: String, default: '' },
    pdfSize: { type: Number, default: 0 },
    pdfUploadedAt: { type: Date, default: null },
    pdfThumbnail: { type: String, default: '' },
    isPdfEvent: { type: Boolean, default: false }
  },
  { timestamps: true }
);

CalendarEventSchema.index({ date: 1 });
CalendarEventSchema.index({ isPdfEvent: 1, date: -1 });

export const CalendarEventModel = model('CalendarEvent', CalendarEventSchema);

