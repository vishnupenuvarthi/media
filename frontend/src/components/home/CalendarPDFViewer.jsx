import { useState, useEffect } from 'react';
import { Document, Page, pdfjs } from 'react-pdf';
import { getBackendUrl } from '@/utils/getBackendUrl';
import { ChevronLeftIcon, ChevronRightIcon, ArrowDownTrayIcon } from '@heroicons/react/24/outline';
import 'react-pdf/dist/esm/Page/AnnotationLayer.css';
import 'react-pdf/dist/esm/Page/TextLayer.css';

// Set worker source
import 'pdfjs-dist/build/pdf.worker.min.mjs';

pdfjs.GlobalWorkerOptions.workerSrc = new URL(
  'pdfjs-dist/build/pdf.worker.min.mjs',
  import.meta.url,
).toString();

export const CalendarPDFViewer = () => {
  const [numPages, setNumPages] = useState(null);
  const [pageNumber, setPageNumber] = useState(1);
  const [loading, setLoading] = useState(true);
  const [containerWidth, setContainerWidth] = useState(800);

  const pdfUrl = `${getBackendUrl()}/api/calendar/nlr-news-calendar-2026.pdf`;

  useEffect(() => {
    const updateWidth = () => {
      const width = window.innerWidth;
      if (width < 640) {
        setContainerWidth(width - 48); // Mobile padding
      } else if (width < 1024) {
        setContainerWidth(width - 64); // Tablet padding
      } else {
        setContainerWidth(800); // Desktop max width
      }
    };

    updateWidth();
    window.addEventListener('resize', updateWidth);
    return () => window.removeEventListener('resize', updateWidth);
  }, []);

  function onDocumentLoadSuccess({ numPages }) {
    setNumPages(numPages);
    setLoading(false);
  }

  function changePage(offset) {
    setPageNumber(prevPageNumber => prevPageNumber + offset);
  }

  function previousPage() {
    changePage(-1);
  }

  function nextPage() {
    changePage(1);
  }

  return (
    <div className="flex flex-col items-center justify-center w-full min-h-[400px] bg-white rounded-xl py-6 border border-gray-100 shadow-sm">
      <Document
        file={pdfUrl}
        onLoadSuccess={onDocumentLoadSuccess}
        onLoadError={(error) => {
          console.error('Error loading PDF:', error);
          setLoading(false);
        }}
        loading={
          <div className="flex flex-col items-center justify-center h-64 w-full gap-3">
            <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-primary"></div>
            <p className="text-sm text-gray-500 font-medium">Loading Calendar...</p>
          </div>
        }
        className="max-w-full shadow-md rounded-lg overflow-hidden border border-gray-200"
      >
        <Page
          pageNumber={pageNumber}
          renderTextLayer={false}
          renderAnnotationLayer={false}
          width={containerWidth}
        />
      </Document>

      {!loading && numPages && (
        <div className="flex flex-col items-center gap-4 mt-6 w-full px-4">
          {/* Pagination Controls */}
          <div className="flex items-center space-x-6 bg-gray-50 px-6 py-2 rounded-full shadow-sm border border-gray-200">
            <button
              type="button"
              disabled={pageNumber <= 1}
              onClick={previousPage}
              className="p-2 rounded-full hover:bg-white hover:shadow-sm disabled:opacity-30 disabled:cursor-not-allowed disabled:hover:bg-transparent disabled:hover:shadow-none transition-all text-gray-700"
              aria-label="Previous page"
            >
              <ChevronLeftIcon className="w-5 h-5" />
            </button>

            <span className="text-gray-700 font-medium font-serif min-w-[100px] text-center text-sm">
              Page {pageNumber} of {numPages}
            </span>

            <button
              type="button"
              disabled={pageNumber >= numPages}
              onClick={nextPage}
              className="p-2 rounded-full hover:bg-white hover:shadow-sm disabled:opacity-30 disabled:cursor-not-allowed disabled:hover:bg-transparent disabled:hover:shadow-none transition-all text-gray-700"
              aria-label="Next page"
            >
              <ChevronRightIcon className="w-5 h-5" />
            </button>
          </div>

          {/* Download Button */}
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

      {!loading && !numPages && (
        <div className="flex flex-col items-center justify-center p-8 text-center bg-red-50 rounded-lg border border-red-100 mx-4">
          <p className="text-red-600 font-medium mb-1">Unable to load Calendar</p>
          <button
            onClick={() => window.location.reload()}
            className="text-xs text-red-500 hover:text-red-700 underline"
          >
            Try refreshing the page
          </button>
        </div>
      )}
    </div>
  );
};
