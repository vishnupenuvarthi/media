
import { useState, useEffect, useRef, useMemo } from 'react';
import { Document, Page, pdfjs } from 'react-pdf';
import { getBackendUrl } from '@/utils/getBackendUrl';
import { ChevronLeftIcon, ChevronRightIcon, ArrowDownTrayIcon, ArrowPathIcon } from '@heroicons/react/24/outline';
import 'react-pdf/dist/esm/Page/AnnotationLayer.css';
import 'react-pdf/dist/esm/Page/TextLayer.css';

// CRITICAL FIX: Use LOCAL worker (v4.4.168) to avoid CORS issues.
// CDN workers often get blocked for Range Requests on large files.

pdfjs.GlobalWorkerOptions.workerSrc = new URL(
  'pdfjs-dist/build/pdf.worker.min.mjs',
  import.meta.url,
).toString();

export const CalendarPDFViewer = () => {
  // Debug Log to confirm version loaded
  useEffect(() => { console.log("CalendarPDFViewer v3.2 Loaded"); }, []);

  const [numPages, setNumPages] = useState(null);
  const [pageNumber, setPageNumber] = useState(1);
  const [loading, setLoading] = useState(true);
  const [containerWidth, setContainerWidth] = useState(600);
  const [key, setKey] = useState(0);
  const touchStartX = useRef(null);

  const pdfUrl = `${getBackendUrl()}/api/calendar/download-pdf`;

  useEffect(() => {
    const updateWidth = () => {
      const width = window.innerWidth;
      // Cap width to improve render speed
      setContainerWidth(Math.min(width - 32, 800));
    };

    updateWidth();
    window.addEventListener('resize', updateWidth);
    return () => window.removeEventListener('resize', updateWidth);
  }, []);

  function onDocumentLoadSuccess({ numPages }) {
    setNumPages(numPages);
    setLoading(false);
  }

  // Pre-calculate options to avoid re-renders
  const options = useMemo(() => ({
    cMapUrl: 'https://cdn.jsdelivr.net/npm/pdfjs-dist@4.4.168/cmaps/',
    cMapPacked: true,
    disableAutoFetch: true, // Only fetch what's needed (Vital for 67MB file)
    disableStream: true,    // Reduce memory overhead
    disableFontFace: true,  // Speed up font loading
  }), []);

  const changePage = (offset) => {
    setPageNumber(prev => Math.min(Math.max(1, prev + offset), numPages || 1));
  };

  const handleRetry = () => {
    setLoading(true);
    setKey(prev => prev + 1); // Remount
  };

  return (
    <div className="flex flex-col items-center w-full min-h-[500px] bg-gray-50/50 rounded-xl border border-gray-100 relative">
      <div className="w-full bg-white rounded-lg shadow-sm border border-gray-100 overflow-hidden min-h-[400px] flex items-center justify-center relative">
        <Document
          key={key}
          file={pdfUrl}
          onLoadSuccess={onDocumentLoadSuccess}
          onLoadError={(err) => {
            console.error("PDF Load Error:", err);
            setLoading(false);
          }}
          loading={
            <div className="flex flex-col items-center gap-3 p-10">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
              <p className="text-sm font-medium text-gray-500">Loading Calendar...</p>
            </div>
          }
          error={
            <div className="flex flex-col items-center gap-4 p-8 text-center">
              <p className="text-red-500 font-medium">Failed to load document.</p>
              <div className="text-xs text-gray-400">Error: V_MISMATCH_FIXED</div>
              <button
                onClick={handleRetry}
                className="px-4 py-2 bg-gray-900 text-white rounded-lg text-sm flex items-center gap-2 hover:bg-gray-800"
              >
                <ArrowPathIcon className="w-4 h-4" /> Retry
              </button>
              <a
                href={pdfUrl}
                download
                className="text-primary text-sm underline"
              >
                Download Instead
              </a>
            </div>
          }
          className="touch-pan-y"
          options={options}
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
            width={containerWidth}
            renderTextLayer={false}
            renderAnnotationLayer={false}
            cleanupAfterRender={true}
            pixelRatio={Math.min(window.devicePixelRatio, 1.5)} // Conservative pixel ratio for mobile
            loading={
              <div className="h-[400px] w-full flex items-center justify-center bg-gray-50">
                <div className="animate-pulse w-3/4 h-3/4 bg-gray-200 rounded-lg"></div>
              </div>
            }
          />
        </Document>

        {/* Navigation Overlays */}
        <div
          className="absolute top-0 bottom-0 left-0 w-16 z-10"
          onClick={() => changePage(-1)}
        />
        <div
          className="absolute top-0 bottom-0 right-0 w-16 z-10"
          onClick={() => changePage(1)}
        />
      </div>

      {/* Footer Controls */}
      {!loading && numPages && (
        <div className="flex items-center justify-between w-full max-w-md mt-4 px-4 pb-4">
          <button
            onClick={() => changePage(-1)}
            disabled={pageNumber <= 1}
            className="p-3 bg-white border border-gray-200 rounded-full shadow-sm disabled:opacity-30 active:scale-95 transition-all"
          >
            <ChevronLeftIcon className="w-5 h-5 text-gray-700" />
          </button>

          <div className="flex flex-col items-center">
            <span className="font-serif font-bold text-lg text-gray-900">
              {pageNumber} / {numPages}
            </span>
            <div className="flex items-center gap-2 mt-1">
              <a
                href={pdfUrl}
                download="NLR-News-Calendar-2026.pdf"
                className="text-xs text-primary font-medium flex items-center gap-1 hover:underline"
              >
                <ArrowDownTrayIcon className="w-3 h-3" /> Download
              </a>
              <span className="text-[10px] text-green-600 font-bold bg-green-50 px-1 rounded">v3.2 LIVE</span>
            </div>
          </div>

          <button
            onClick={() => changePage(1)}
            disabled={pageNumber >= numPages}
            className="p-3 bg-white border border-gray-200 rounded-full shadow-sm disabled:opacity-30 active:scale-95 transition-all"
          >
            <ChevronRightIcon className="w-5 h-5 text-gray-700" />
          </button>
        </div>
      )}
    </div>
  );
};
