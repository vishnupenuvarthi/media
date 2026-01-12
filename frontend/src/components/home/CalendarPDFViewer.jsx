
import { useState, useEffect } from 'react';
import { getBackendUrl } from '@/utils/getBackendUrl';
import { ArrowDownTrayIcon, DocumentTextIcon } from '@heroicons/react/24/outline';

// Native Browser PDF Viewer
// Robust against large files (67MB) because it uses the browser's native C++ engine (PDFium/PDFKit)
// instead of JavaScript-based parsing (react-pdf) which crashes on large files.
export const CalendarPDFViewer = () => {
  const [browserType, setBrowserType] = useState('unknown');

  const pdfUrl = `${getBackendUrl()} /api/calendar / download - pdf`;

  useEffect(() => {
    // Basic detection to provide helpful hints
    const ua = navigator.userAgent.toLowerCase();
    if (ua.includes("android")) setBrowserType('android');
    else if (ua.includes("iphone") || ua.includes("ipad")) setBrowserType('ios');
    else setBrowserType('desktop');
  }, []);

  return (
    <div className="flex flex-col items-center justify-center w-full bg-white rounded-xl overflow-hidden border border-gray-100 shadow-sm">
      {/* 
         Native Object Tag:
         - Desktop (Chrome/Safari/Edge/Firefox): Renders full PDF UI.
         - iOS (Safari): Renders PDF natively inline.
         - Android (Chrome): Might show gray box or ask to download.
      */}
      <div className="w-full h-[85vh] min-h-[500px] relative bg-gray-50">
        <object
          data={pdfUrl}
          type="application/pdf"
          className="w-full h-full"
        >
          {/* Fallback Content: Shown if browser cannot display PDF inline (e.g. some mobile browsers) */}
          <div className="flex flex-col items-center justify-center h-full p-8 text-center bg-white">
            <div className="bg-primary/5 p-4 rounded-full mb-4">
              <DocumentTextIcon className="w-12 h-12 text-primary" />
            </div>
            <h3 className="text-xl font-serif font-bold text-gray-900 mb-2">
              View Calendar
            </h3>
            <p className="text-gray-600 mb-6 max-w-sm mx-auto">
              Your browser suggests downloading this large file (67MB) instead of displaying it here.
            </p>
            <a
              href={pdfUrl}
              download="NLR-News-Calendar-2026.pdf"
              className="flex items-center gap-2 px-8 py-3 bg-primary text-white rounded-lg hover:bg-primary/90 transition-all font-semibold shadow-lg active:scale-95"
            >
              <ArrowDownTrayIcon className="w-5 h-5" />
              Download PDF Directly
            </a>
          </div>
        </object>
      </div>

      {/* Footer Actions */}
      <div className="w-full p-4 bg-white border-t border-gray-100 flex flex-col sm:flex-row items-center justify-between gap-4">
        <span className="text-sm text-gray-500 hidden sm:block">
          NLR News Calendar 2026
        </span>

        <div className="flex items-center gap-3 w-full sm:w-auto">
          <a
            href={pdfUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="flex-1 sm:flex-none flex items-center justify-center gap-2 px-4 py-2 text-sm font-medium text-gray-700 bg-gray-100 hover:bg-gray-200 rounded-lg transition-colors"
          >
            <DocumentTextIcon className="w-4 h-4" />
            Open in New Tab
          </a>
          <a
            href={pdfUrl}
            download="NLR-News-Calendar-2026.pdf"
            className="flex-1 sm:flex-none flex items-center justify-center gap-2 px-4 py-2 text-sm font-medium text-white bg-primary hover:bg-primary/90 rounded-lg shadow-sm transition-all"
          >
            <ArrowDownTrayIcon className="w-4 h-4" />
            Download
          </a>
        </div>
      </div>
    </div>
  );
};

