import { CalendarPDFViewer } from '@/components/home/CalendarPDFViewer';

const YEAR = 2026;

export const CalendarPage = () => {
  return (
    <div className="max-w-6xl mx-auto px-4 py-10 space-y-8">
      <header className="space-y-2 text-center">
        <p className="text-xs uppercase tracking-[0.5em] text-primary font-bold">CALENDAR</p>
        <h1 className="text-3xl md:text-4xl font-serif font-bold text-gray-900">
          NLR News Calendar {YEAR}
        </h1>
        <p className="text-gray-600 max-w-2xl mx-auto text-sm md:text-base">
          View and download the comprehensive newsroom calendar for {YEAR}.
          Stay updated with all major events and schedules.
        </p>
      </header>

      <div className="flex justify-center w-full">
        <div className="w-full max-w-4xl">
          <CalendarPDFViewer />
        </div>
      </div>
    </div>
  );
};
