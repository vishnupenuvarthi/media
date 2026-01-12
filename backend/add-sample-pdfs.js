// Quick script to add sample PDF data to MongoDB
import mongoose from 'mongoose';
import dotenv from 'dotenv';
dotenv.config();

const CalendarEventSchema = new mongoose.Schema({
  title: String,
  description: String,
  date: Date,
  category: String,
  location: String,
  tags: [String],
  pdfUrl: String,
  pdfFileName: String,
  pdfSize: Number,
  pdfUploadedAt: Date,
  pdfThumbnail: String,
  isPdfEvent: Boolean,
  createdAt: Date,
  updatedAt: Date
});

const CalendarEvent = mongoose.model('CalendarEvent', CalendarEventSchema);

const samplePDFs = [
  {
    title: '2026 Editorial Calendar',
    description: 'Complete editorial planning and publication schedule for 2026',
    date: new Date('2026-01-15'),
    category: 'pdf',
    location: 'NLR Headquarters',
    tags: ['calendar', 'planning', '2026'],
    pdfUrl: 'https://example.com/pdfs/editorial-calendar-2026.pdf',
    pdfFileName: 'editorial-calendar-2026.pdf',
    pdfSize: 2048576,
    pdfUploadedAt: new Date(),
    isPdfEvent: true
  },
  {
    title: 'Budget Guidelines 2026',
    description: '2026 budget allocation and spending guidelines',
    date: new Date('2026-02-01'),
    category: 'pdf',
    location: 'Finance Department',
    tags: ['budget', 'guidelines', 'finance'],
    pdfUrl: 'https://example.com/pdfs/budget-guidelines-2026.pdf',
    pdfFileName: 'budget-guidelines-2026.pdf',
    pdfSize: 1536000,
    pdfUploadedAt: new Date(),
    isPdfEvent: true
  },
  {
    title: 'Team Calendar Q1 2026',
    description: 'First quarter team meetings and events schedule',
    date: new Date('2026-01-05'),
    category: 'pdf',
    location: 'HR Department',
    tags: ['calendar', 'team', 'q1'],
    pdfUrl: 'https://example.com/pdfs/team-calendar-q1-2026.pdf',
    pdfFileName: 'team-calendar-q1-2026.pdf',
    pdfSize: 890000,
    pdfUploadedAt: new Date(),
    isPdfEvent: true
  },
  {
    title: 'Holiday Schedule 2026',
    description: 'Official holidays and office closure dates for 2026',
    date: new Date('2025-12-20'),
    category: 'pdf',
    location: 'HR Department',
    tags: ['holidays', 'schedule', 'office'],
    pdfUrl: 'https://example.com/pdfs/holiday-schedule-2026.pdf',
    pdfFileName: 'holiday-schedule-2026.pdf',
    pdfSize: 456000,
    pdfUploadedAt: new Date(),
    isPdfEvent: true
  },
  {
    title: 'Editorial Style Guide',
    description: 'Writing standards and style guidelines for all publications',
    date: new Date('2026-03-10'),
    category: 'pdf',
    location: 'Editorial Office',
    tags: ['style', 'guidelines', 'writing'],
    pdfUrl: 'https://example.com/pdfs/editorial-style-guide.pdf',
    pdfFileName: 'editorial-style-guide.pdf',
    pdfSize: 3145728,
    pdfUploadedAt: new Date(),
    isPdfEvent: true
  },
  {
    title: 'Content Planning Template',
    description: 'Template for monthly content planning and tracking',
    date: new Date('2026-02-15'),
    category: 'pdf',
    location: 'Content Team',
    tags: ['template', 'content', 'planning'],
    pdfUrl: 'https://example.com/pdfs/content-planning-template.pdf',
    pdfFileName: 'content-planning-template.pdf',
    pdfSize: 1024000,
    pdfUploadedAt: new Date(),
    isPdfEvent: true
  },
  {
    title: 'Social Media Calendar',
    description: 'Weekly social media posting schedule and guidelines',
    date: new Date('2026-01-20'),
    category: 'pdf',
    location: 'Social Media Team',
    tags: ['social', 'calendar', 'marketing'],
    pdfUrl: 'https://example.com/pdfs/social-media-calendar.pdf',
    pdfFileName: 'social-media-calendar.pdf',
    pdfSize: 2097152,
    pdfUploadedAt: new Date(),
    isPdfEvent: true
  },
  {
    title: 'Analytics Report Jan 2026',
    description: 'Monthly analytics and performance metrics report',
    date: new Date('2026-02-05'),
    category: 'pdf',
    location: 'Analytics Team',
    tags: ['analytics', 'report', 'january'],
    pdfUrl: 'https://example.com/pdfs/analytics-report-jan-2026.pdf',
    pdfFileName: 'analytics-report-jan-2026.pdf',
    pdfSize: 4194304,
    pdfUploadedAt: new Date(),
    isPdfEvent: true
  },
  {
    title: 'Video Production Schedule',
    description: 'Upcoming video production dates and assignments',
    date: new Date('2026-01-25'),
    category: 'pdf',
    location: 'Video Production',
    tags: ['video', 'production', 'schedule'],
    pdfUrl: 'https://example.com/pdfs/video-production-schedule.pdf',
    pdfFileName: 'video-production-schedule.pdf',
    pdfSize: 2752512,
    pdfUploadedAt: new Date(),
    isPdfEvent: true
  },
  {
    title: 'Training Schedule 2026',
    description: 'Staff training programs and certification schedules',
    date: new Date('2026-02-10'),
    category: 'pdf',
    location: 'Training Department',
    tags: ['training', 'schedule', 'development'],
    pdfUrl: 'https://example.com/pdfs/training-schedule-2026.pdf',
    pdfFileName: 'training-schedule-2026.pdf',
    pdfSize: 1835008,
    pdfUploadedAt: new Date(),
    isPdfEvent: true
  },
  {
    title: 'Marketing Plan 2026',
    description: 'Annual marketing strategy and campaign planning document',
    date: new Date('2026-01-30'),
    category: 'pdf',
    location: 'Marketing Department',
    tags: ['marketing', 'plan', 'strategy'],
    pdfUrl: 'https://example.com/pdfs/marketing-plan-2026.pdf',
    pdfFileName: 'marketing-plan-2026.pdf',
    pdfSize: 3670016,
    pdfUploadedAt: new Date(),
    isPdfEvent: true
  },
  {
    title: 'Event Calendar 2026',
    description: 'All major corporate events and conferences scheduled',
    date: new Date('2026-01-10'),
    category: 'pdf',
    location: 'Events Team',
    tags: ['events', 'calendar', 'conferences'],
    pdfUrl: 'https://example.com/pdfs/event-calendar-2026.pdf',
    pdfFileName: 'event-calendar-2026.pdf',
    pdfSize: 2560000,
    pdfUploadedAt: new Date(),
    isPdfEvent: true
  }
];

async function addSamplePDFs() {
  try {
    await mongoose.connect(process.env.MONGO_URI);
    console.log('Connected to MongoDB');

    // Delete existing PDFs to avoid duplicates
    await CalendarEvent.deleteMany({ isPdfEvent: true });
    console.log('Cleared existing PDF events');

    // Insert sample PDFs
    const result = await CalendarEvent.insertMany(samplePDFs);
    console.log(`✅ Successfully added ${result.length} sample PDFs to the calendar`);
    console.log('PDFs added:');
    result.forEach((pdf) => {
      console.log(`  - ${pdf.title}`);
    });

    process.exit(0);
  } catch (error) {
    console.error('❌ Error adding sample PDFs:', error.message);
    process.exit(1);
  }
}

addSamplePDFs();
