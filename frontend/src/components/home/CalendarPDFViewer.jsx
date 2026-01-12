
import { useState, useEffect, useRef } from 'react';
import { Document, Page, pdfjs } from 'react-pdf';
import { getBackendUrl } from '@/utils/getBackendUrl';
import { ChevronLeftIcon, ChevronRightIcon, ArrowDownTrayIcon, DocumentTextIcon } from '@heroicons/react/24/outline';
import 'react-pdf/dist/esm/Page/AnnotationLayer.css';
import 'react-pdf/dist/esm/Page/TextLayer.css';

// Use LOCAL worker to avoid Cross-Origin Resource Sharing (CORS) issues with Range Requests
// This allows the worker to efficiently fetch chunks of the 67MB file without errors.
pdfjs.GlobalWorkerOptions.workerSrc = `/pdf.worker.min.mjs`;

export const CalendarPDFViewer = () => {
  const [numPages, setNumPages] = useState(null);
  const [pageNumber, setPageNumber] = useState(1);
  const [loading, setLoading] = useState(true);
  const [containerWidth, setContainerWidth] = useState(800);
  const [isMobile, setIsMobile] = useState(false);
  const [useFallback, setUseFallback] = useState(false); // New fallback state
  const [errorMsg, setErrorMsg] = useState(null);
  const touchStartX = useRef(null);

  const pdfUrl = `${getBackendUrl()}/api/calendar/download-pdf`;

  useEffect(() => {
    const checkMobile = () => {
      const width = window.innerWidth;
      setIsMobile(width < 1024);

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
    setUseFallback(false);
    setErrorMsg(null);
  }

  function changePage(offset) {
    setPageNumber(prevPageNumber => prevPageNumber + offset);
  }

  // MOBILE/TABLET: FORCE NATIVE VIEW IMMEDIATELY
  // Do not attempt to load React-PDF on mobile for this 67MB file.
  // It causes OOM (Out of Memory) crashes before the error handler can trigger.
  if (isMobile || useFallback) {
    return (
      <div className="flex flex-col items-center justify-center w-full bg-gray-50 rounded-xl overflow-hidden border border-gray-100 shadow-sm h-[85vh] relative">
        <div className="absolute top-4 left-0 right-0 z-10 flex justify-center pointer-events-none">
          <span className="bg-black/60 text-white text-[10px] uppercase tracking-wider font-bold px-3 py-1 rounded-full backdrop-blur-md shadow-sm">
            Native PDF Viewer
          </span>
        </div>

        {/* Object tag is the most robust way to trigger native PDF handling */}
        <object
          data={pdfUrl}
          type="application/pdf"
          className="w-full h-full"
        >
          {/* Fallback for browsers (old Android) that cannot embed PDF */}
          <div className="flex flex-col items-center justify-center h-full p-6 text-center">
            <div className="bg-white p-4 rounded-full shadow-sm mb-4">
              <DocumentTextIcon className="w-10 h-10 text-primary" />
            </div>
            <p className="text-gray-900 font-semibold mb-2">Device limit reached</p>
            <p className="text-gray-500 text-sm mb-6 max-w-xs mx-auto">
              This calendar file (67MB) is too large to display inside your current browser.
            </p>
            <a
              href={pdfUrl}
              download="NLR-News-Calendar-2026.pdf"
              className="px-6 py-3 bg-primary text-white hover:bg-primary/90 rounded-lg shadow-lg text-sm font-semibold flex items-center gap-2 transition-all active:scale-95"
            >
              <ArrowDownTrayIcon className="w-5 h-5" />
              Download PDF
            </a>
          </div>
        </object>
      </div>
    );
  }

  return (
    <div className="flex flex-col items-center justify-center w-full min-h-[400px] bg-white rounded-xl py-6 border border-gray-100 shadow-sm relative">
      <Document
        file={pdfUrl}
        onLoadSuccess={onDocumentLoadSuccess}
        onLoadError={(error) => {
          console.error('Error loading PDF, switching to fallback:', error);
          setLoading(false);
          // CRITICAL: Switch to fallback iframe immediately on error
          setUseFallback(true);
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
          disableAutoFetch: true, // Range requests (Crucial for 67MB)
          disableStream: false,
        }}
        onTouchStart={(e) => {
          touchStartX.current = e.changedTouches[0].screenX;
        }}
        onTouchEnd={(e) => {
          if (!touchStartX.current) return;
          const touchEndX = e.changedTouches[0].screenX;
          const diff = touchStartX.current - touchEndX;

          if (Math.abs(diff) > 50) {
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
          // Reduce memory usage on mobile
          pixelRatio={isMobile ? 1.0 : undefined}
          error={
            <div className="p-4 text-xs text-red-500 text-center">
              Page render error.
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

      {/* Explicit Error State */}
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
