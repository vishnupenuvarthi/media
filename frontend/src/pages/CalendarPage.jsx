import { CalendarPDFViewerNew } from '@/components/home/CalendarPDFViewerNew';
import { ErrorBoundary } from '@/components/common/ErrorBoundary';
import { getBackendUrl } from '@/utils/getBackendUrl';
import { ArrowDownTrayIcon } from '@heroicons/react/24/outline';

const YEAR = 2026;

export const CalendarPage = () => {
  const pdfUrl = `${getBackendUrl()}/api/calendar/download-pdf`;

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
          <ErrorBoundary fallback={
            <div className="p-8 text-center bg-gray-50 rounded-xl border border-gray-200">
              <p className="mb-4 text-gray-600">The PDF viewer encountered an error.</p>
              <a
                href={pdfUrl}
                download="NLR-News-Calendar-2026.pdf"
                className="inline-flex items-center gap-2 px-6 py-2.5 bg-primary text-white rounded-lg hover:bg-primary/90 transition-all shadow-md"
              >
                <ArrowDownTrayIcon className="w-5 h-5" />
                Download PDF Directly
              </a>
            </div>
          }>
            <CalendarPDFViewerNew />
          </ErrorBoundary>
        </div>
      </div>
    </div>
  );
};
