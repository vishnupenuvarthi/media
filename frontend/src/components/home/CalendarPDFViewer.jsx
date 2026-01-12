import { useState, useEffect, useRef } from 'react';
import { Document, Page, pdfjs } from 'react-pdf';
import { getBackendUrl } from '@/utils/getBackendUrl';
import { ChevronLeftIcon, ChevronRightIcon, ArrowDownTrayIcon, DocumentTextIcon } from '@heroicons/react/24/outline';
import 'react-pdf/dist/esm/Page/AnnotationLayer.css';
import 'react-pdf/dist/esm/Page/TextLayer.css';

// Use JSDelivr for better stability and cache hits
pdfjs.GlobalWorkerOptions.workerSrc = `https://cdn.jsdelivr.net/npm/pdfjs-dist@4.4.168/build/pdf.worker.min.mjs`;

export const CalendarPDFViewer = () => {
  const [numPages, setNumPages] = useState(null);
  const [pageNumber, setPageNumber] = useState(1);
  const [loading, setLoading] = useState(true);
  const [containerWidth, setContainerWidth] = useState(800);
  const [isMobile, setIsMobile] = useState(false);
  const [errorMsg, setErrorMsg] = useState(null);
  const touchStartX = useRef(null);

  const pdfUrl = `${getBackendUrl()}/api/calendar/download-pdf`;

  useEffect(() => {
    const checkMobile = () => {
      const width = window.innerWidth;
      setIsMobile(width < 640);

      if (width < 640) {
        setContainerWidth(width - 32);
      } else if (width < 1024) {
        setContainerWidth(width - 64);
      } else {
        setContainerWidth(800);
      }
    };

    checkMobile();
    window.addEventListener('resize', checkMobile);
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  function onDocumentLoadSuccess({ numPages }) {
    setNumPages(numPages);
    setLoading(false);
    setErrorMsg(null);
  }

  function changePage(offset) {
    setPageNumber(prevPageNumber => prevPageNumber + offset);
  }

  // MOBILE VIEW: Return early to avoid crashing react-pdf on low memory devices
  if (isMobile) {
    return (
      <div className="flex flex-col items-center justify-center w-full bg-white rounded-xl p-8 border border-gray-100 shadow-sm text-center">
        <div className="bg-red-50 p-4 rounded-full mb-4">
          <DocumentTextIcon className="w-12 h-12 text-primary" />
        </div>
        <h3 className="text-lg font-serif font-bold text-gray-900 mb-2">
          View Calendar PDF
        </h3>
        <p className="text-sm text-gray-500 mb-6 max-w-xs mx-auto">
          The calendar file is large (67MB). For the best experience on mobile, please download it directly.
        </p>
        <div className="flex flex-col gap-3 w-full sm:w-auto">
          <a
            href={pdfUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center justify-center gap-2 px-6 py-3 bg-white text-primary border-2 border-primary/20 rounded-lg hover:bg-primary/5 transition-all font-semibold active:scale-95"
          >
            <DocumentTextIcon className="w-5 h-5" />
            Open in Browser
          </a>
          <a
            href={pdfUrl}
            download="NLR-News-Calendar-2026.pdf"
            className="flex items-center justify-center gap-2 px-6 py-3 bg-primary text-white rounded-lg hover:bg-primary/90 transition-all shadow-md active:scale-95 font-semibold"
          >
            <ArrowDownTrayIcon className="w-5 h-5" />
            Download PDF
          </a>
        </div>
      </div>
    );
  }

  return (
    <div className="flex flex-col items-center justify-center w-full min-h-[400px] bg-white rounded-xl py-6 border border-gray-100 shadow-sm relative">
      <Document
        file={pdfUrl}
        onLoadSuccess={onDocumentLoadSuccess}
        onLoadError={(error) => {
          console.error('Error loading PDF:', error);
          setLoading(false);
          setErrorMsg("Unable to load PDF viewer.");
        }}
        loading={
          <div className="flex flex-col items-center justify-center h-64 w-full gap-3">
            <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-primary"></div>
            <p className="text-sm text-gray-500 font-medium">Loading Calendar...</p>
          </div>
        }
        className="max-w-full shadow-md rounded-lg overflow-hidden border border-gray-200 touch-pan-y"
        options={{
          cMapUrl: 'https://cdn.jsdelivr.net/npm/pdfjs-dist@4.4.168/cmaps/',
          cMapPacked: true,
          disableAutoFetch: true, // Only fetch needed chunks (Range requests)
          disableStream: false,   // Enable streaming
        }}
        onTouchStart={(e) => {
          touchStartX.current = e.changedTouches[0].screenX;
        }}
        onTouchEnd={(e) => {
          if (!touchStartX.current) return;
          const touchEndX = e.changedTouches[0].screenX;
          const diff = touchStartX.current - touchEndX;

          if (Math.abs(diff) > 50) { // Threshold 50px
            if (diff > 0) {
              if (pageNumber < numPages) changePage(1);
            } else {
              if (pageNumber > 1) changePage(-1);
            }
          }
          touchStartX.current = null;
        }}
      >
        <Page
          pageNumber={pageNumber}
          renderTextLayer={false}
          renderAnnotationLayer={false}
          width={containerWidth}
          error={
            <div className="p-4 text-xs text-red-500 text-center">
              Page render error. Please download.
            </div>
          }
        />
      </Document>

      {!loading && numPages && (
        <div className="flex flex-col items-center gap-4 mt-6 w-full px-4">
          <div className="flex items-center space-x-6 bg-gray-50 px-6 py-2 rounded-full shadow-sm border border-gray-200">
            <button
              type="button"
              disabled={pageNumber <= 1}
              onClick={() => changePage(-1)}
              className="p-2 rounded-full hover:bg-white hover:shadow-sm disabled:opacity-30 disabled:cursor-not-allowed transition-all text-gray-700"
            >
              <ChevronLeftIcon className="w-5 h-5" />
            </button>

            <span className="text-gray-700 font-medium font-serif min-w-[100px] text-center text-sm">
              Page {pageNumber} of {numPages}
            </span>

            <button
              type="button"
              disabled={pageNumber >= numPages}
              onClick={() => changePage(1)}
              className="p-2 rounded-full hover:bg-white hover:shadow-sm disabled:opacity-30 disabled:cursor-not-allowed transition-all text-gray-700"
            >
              <ChevronRightIcon className="w-5 h-5" />
            </button>
          </div>

          <a
            href={pdfUrl}
            download="NLR-News-Calendar-2026.pdf"
            className="flex items-center gap-2 px-6 py-2.5 bg-primary text-white rounded-lg hover:bg-primary/90 transition-all shadow-md hover:shadow-lg text-sm font-semibold active:scale-95"
          >
            <ArrowDownTrayIcon className="w-5 h-5" />
            Download Calendar PDF
          </a>
        </div>
      )}

      {/* Explicit Error State within Viewer (in case ErrorBoundary doesn't catch it) */}
      {!loading && (!numPages || errorMsg) && (
        <div className="flex flex-col items-center justify-center p-8 text-center bg-red-50 rounded-lg border border-red-100 mx-4 w-full">
          <p className="text-red-700 font-medium mb-2">{errorMsg || "Unable to load Calendar"}</p>
          <a
            href={pdfUrl}
            download="NLR-News-Calendar-2026.pdf"
            className="inline-flex items-center gap-2 px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition font-medium text-sm"
          >
            <ArrowDownTrayIcon className="w-4 h-4" />
            Download Directly
          </a>
        </div>
      )}
    </div>
  );
};
