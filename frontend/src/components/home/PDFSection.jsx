import { useState, useMemo } from 'react';
import { useQuery } from '@tanstack/react-query';
import { DocumentArrowDownIcon, DocumentTextIcon } from '@heroicons/react/24/outline';
import dayjs from '@/utils/dayjs';
import { api } from '@/lib/api';

const ITEMS_PER_PAGE = 9;

export const PDFSection = () => {
  const [currentPage, setCurrentPage] = useState(1);

  // Fetch PDFs
  const { data: pdfData, isLoading } = useQuery({
    queryKey: ['calendar-pdfs'],
    queryFn: async () => {
      try {
        const { data } = await api.get('/calendar/events?year=2026');
        return data;
      } catch {
        return { events: [] };
      }
    }
  });

  // Filter only PDF events
  const sortedPdfs = useMemo(() => {
    const events = pdfData?.events || [];
    return events
      .filter((event) => event.pdfUrl)
      .sort((a, b) => new Date(b.date) - new Date(a.date));
  }, [pdfData]);

  // Calculate pagination
  const totalPages = Math.ceil(sortedPdfs.length / ITEMS_PER_PAGE);
  const startIdx = (currentPage - 1) * ITEMS_PER_PAGE;
  const paginatedPdfs = sortedPdfs.slice(startIdx, startIdx + ITEMS_PER_PAGE);

  // Format file size
  const formatFileSize = (bytes) => {
    if (!bytes) return 'N/A';
    if (bytes < 1024) return `${bytes} B`;
    if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
    return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
  };

  if (isLoading) {
    return (
      <div className="animate-pulse space-y-4">
        <div className="h-8 bg-gray-200 rounded w-1/4" />
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {Array.from({ length: 6 }).map((_, i) => (
            <div key={i} className="bg-gray-100 rounded-lg h-48" />
          ))}
        </div>
      </div>
    );
  }

  if (!sortedPdfs || sortedPdfs.length === 0) {
    return (
      <div className="text-center py-12 bg-gray-50 rounded-xl">
        <DocumentTextIcon className="w-16 h-16 text-gray-300 mx-auto mb-4" />
        <h3 className="text-lg font-bold text-gray-900 mb-2">No PDFs Yet</h3>
        <p className="text-gray-600">Upload PDFs to display them here.</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Title */}
      <div>
        <h2 className="text-2xl font-bold">Calendar PDFs</h2>
        <p className="text-gray-600">Showing {paginatedPdfs.length} of {sortedPdfs.length} PDFs</p>
      </div>

      {/* Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {paginatedPdfs.map((pdf) => (
          <div key={pdf.id} className="bg-white rounded-lg border border-gray-200 p-4 hover:shadow-lg transition">
            <div className="flex items-center mb-3">
              <DocumentTextIcon className="w-10 h-10 text-orange-600" />
              <span className="ml-2 text-sm font-semibold text-gray-600">{pdf.pdfFileName || 'PDF'}</span>
            </div>
            
            <h3 className="font-semibold text-lg mb-2 line-clamp-2">{pdf.title}</h3>
            
            {pdf.description && (
              <p className="text-sm text-gray-600 mb-3 line-clamp-2">{pdf.description}</p>
            )}

            <div className="space-y-2 mb-4 text-xs text-gray-500">
              {pdf.date && <p>📅 {dayjs(pdf.date).format('MMM D, YYYY')}</p>}
              {pdf.pdfSize && <p>📦 {formatFileSize(pdf.pdfSize)}</p>}
              {pdf.location && <p>📍 {pdf.location}</p>}
            </div>

            {pdf.tags && pdf.tags.length > 0 && (
              <div className="flex flex-wrap gap-1 mb-4">
                {pdf.tags.map((tag) => (
                  <span key={tag} className="text-xs bg-orange-100 text-orange-700 px-2 py-1 rounded">
                    {tag}
                  </span>
                ))}
              </div>
            )}

            <a
              href={pdf.pdfUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="w-full bg-orange-600 text-white py-2 rounded flex items-center justify-center hover:bg-orange-700 transition"
            >
              <DocumentArrowDownIcon className="w-4 h-4 mr-2" />
              Download
            </a>
          </div>
        ))}
      </div>

      {/* Pagination */}
      {totalPages > 1 && (
        <div className="flex items-center justify-center gap-2 mt-8">
          <button
            onClick={() => setCurrentPage(p => Math.max(1, p - 1))}
            disabled={currentPage === 1}
            className="px-4 py-2 border border-gray-300 rounded hover:bg-gray-100 disabled:opacity-50"
          >
            Previous
          </button>

          {Array.from({ length: totalPages }).map((_, i) => {
            const pageNum = i + 1;
            const isActive = pageNum === currentPage;
            return (
              <button
                key={pageNum}
                onClick={() => setCurrentPage(pageNum)}
                className={`w-10 h-10 rounded ${
                  isActive
                    ? 'bg-orange-600 text-white'
                    : 'border border-gray-300 hover:bg-gray-100'
                }`}
              >
                {pageNum}
              </button>
            );
          })}

          <button
            onClick={() => setCurrentPage(p => Math.min(totalPages, p + 1))}
            disabled={currentPage === totalPages}
            className="px-4 py-2 border border-gray-300 rounded hover:bg-gray-100 disabled:opacity-50"
          >
            Next
          </button>
        </div>
      )}
    </div>
  );
};
