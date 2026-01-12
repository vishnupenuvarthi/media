import { useState, useEffect, useRef, useMemo } from 'react';
import { Document, Page, pdfjs } from 'react-pdf';
import { getBackendUrl } from '@/utils/getBackendUrl';
import { ChevronLeftIcon, ChevronRightIcon, ArrowDownTrayIcon, ArrowPathIcon } from '@heroicons/react/24/outline';
import 'react-pdf/dist/esm/Page/AnnotationLayer.css';
import 'react-pdf/dist/esm/Page/TextLayer.css';

// FIX: Use LOCAL worker v4.4.168 to avoid iOS Cross-Origin Worker blocks
pdfjs.GlobalWorkerOptions.workerSrc = `/pdf.worker.min.mjs`;

export const CalendarPDFViewerNew = () => {
    // Debug Log
    useEffect(() => { console.log("CalendarPDFViewerNew v100.0 HYPER Loaded"); }, []);

    const [numPages, setNumPages] = useState(null);
    const [pageNumber, setPageNumber] = useState(1);
    const [loading, setLoading] = useState(true);
    const [errorMsg, setErrorMsg] = useState(null);
    const [loadProgress, setLoadProgress] = useState(0);
    const [containerWidth, setContainerWidth] = useState(600);
    const [key, setKey] = useState(0);
    const [isPageLoaded, setIsPageLoaded] = useState(false); // Track if current page is done
    const touchStartX = useRef(null);

    const pdfUrl = `${getBackendUrl()}/api/calendar/download-pdf`;

    useEffect(() => {
        const updateWidth = () => {
            const width = window.innerWidth;
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

    const onPageLoadSuccess = () => {
        setIsPageLoaded(true);
    };

    const options = useMemo(() => ({
        cMapUrl: 'https://cdn.jsdelivr.net/npm/pdfjs-dist@4.4.168/cmaps/',
        cMapPacked: true,
        disableAutoFetch: true,
        disableStream: true,
        disableFontFace: true,
    }), []);

    const changePage = (offset) => {
        const newPage = Math.min(Math.max(1, pageNumber + offset), numPages || 1);
        if (newPage !== pageNumber) {
            setPageNumber(newPage);
            setIsPageLoaded(false); // Reset load state for new page
        }
    };

    const handleRetry = () => {
        setLoading(true);
        setErrorMsg(null);
        setLoadProgress(0);
        setKey(prev => prev + 1);
    };

    // iOS Optimization: Cap pixelRatio at 1.0 for mobile to prevent Canvas OOM
    const isMobile = typeof window !== 'undefined' && window.innerWidth < 768;
    const pixelRatio = isMobile ? 1.0 : Math.min(window.devicePixelRatio, 1.5);

    return (
        <div className="flex flex-col items-center w-full min-h-[500px] bg-gray-50/50 rounded-xl border border-gray-100 relative">
            <div className="w-full bg-white rounded-lg shadow-sm border border-gray-100 overflow-hidden min-h-[500px] flex items-center justify-center relative touch-manipulation">
                <Document
                    key={key}
                    file={pdfUrl}
                    onLoadSuccess={onDocumentLoadSuccess}
                    onLoadProgress={({ loaded, total }) => {
                        if (total > 0) {
                            setLoadProgress(Math.round((loaded / total) * 100));
                        }
                    }}
                    onLoadError={(err) => {
                        console.error("PDF Load Error:", err);
                        setLoading(false);
                        setErrorMsg(err.message);
                    }}
                    loading={
                        <div className="flex flex-col items-center gap-4 p-10">
                            <div className="relative w-16 h-16">
                                <div className="absolute inset-0 border-4 border-gray-100 rounded-full"></div>
                                <div className="absolute inset-0 border-4 border-primary border-t-transparent rounded-full animate-spin"></div>
                            </div>
                            <div className="text-center">
                                <p className="text-sm font-bold text-gray-900">Loading Calendar...</p>
                                <p className="text-xs text-gray-500 mt-1">{loadProgress}% Downloaded</p>
                            </div>
                        </div>
                    }
                    error={
                        <div className="flex flex-col items-center gap-4 p-8 text-center px-4">
                            <div className="p-3 bg-red-50 rounded-full">
                                <ArrowDownTrayIcon className="w-6 h-6 text-red-500" />
                            </div>
                            <div>
                                <p className="text-red-600 font-bold mb-1">Unable to load PDF</p>
                                <p className="text-xs text-red-400 font-mono bg-red-50 p-2 rounded break-all max-w-[280px]">
                                    {errorMsg || "Unknown connection error"}
                                </p>
                            </div>
                            <button
                                onClick={handleRetry}
                                className="px-6 py-2 bg-gray-900 text-white rounded-full text-sm font-medium flex items-center gap-2 hover:bg-gray-800 transition-colors shadow-lg shadow-gray-200"
                            >
                                <ArrowPathIcon className="w-4 h-4" /> Retry Connection
                            </button>
                            <div className="text-xs text-gray-400 mt-2">
                                Or <a href={pdfUrl} download className="text-primary underline">download file</a> (67MB)
                            </div>
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
                    {/* Main Page - Always Visible */}
                    <div className="transform-gpu will-change-transform">
                        <Page
                            key={`page_${pageNumber}`}
                            pageNumber={pageNumber}
                            width={containerWidth}
                            onRenderSuccess={onPageLoadSuccess}
                            renderTextLayer={false}
                            renderAnnotationLayer={false}
                            cleanupAfterRender={true}
                            pixelRatio={pixelRatio}
                            loading={
                                <div className="h-[500px] w-full flex flex-col items-center justify-center bg-gray-50/50">
                                    <div className="w-12 h-12 border-4 border-gray-200 border-t-gray-400 rounded-full animate-spin mb-4"></div>
                                    <span className="text-xs text-gray-400 font-medium animate-pulse">Rendering Page {pageNumber}...</span>
                                </div>
                            }
                        />
                    </div>

                    {/* Pre-load NEXT page (Always Mounted, Hidden) - INSTANT NEXT */}
                    {pageNumber < numPages && (
                        <div style={{ display: 'none' }}>
                            <Page
                                key={`preload_next_${pageNumber + 1}`}
                                pageNumber={pageNumber + 1}
                                width={containerWidth}
                                renderTextLayer={false}
                                renderAnnotationLayer={false}
                                cleanupAfterRender={false}
                                pixelRatio={pixelRatio}
                            />
                        </div>
                    )}

                    {/* Pre-load NEXT+1 page (Aggressive Cache) */}
                    {pageNumber + 1 < numPages && (
                        <div style={{ display: 'none' }}>
                            <Page
                                key={`preload_next2_${pageNumber + 2}`}
                                pageNumber={pageNumber + 2}
                                width={containerWidth}
                                renderTextLayer={false}
                                renderAnnotationLayer={false}
                                cleanupAfterRender={false}
                                pixelRatio={pixelRatio}
                            />
                        </div>
                    )}

                    {/* Pre-load PREVIOUS page (Always Mounted, Hidden) - INSTANT BACK */}
                    {pageNumber > 1 && (
                        <div style={{ display: 'none' }}>
                            <Page
                                key={`preload_prev_${pageNumber - 1}`}
                                pageNumber={pageNumber - 1}
                                width={containerWidth}
                                renderTextLayer={false}
                                renderAnnotationLayer={false}
                                cleanupAfterRender={false}
                                pixelRatio={pixelRatio}
                            />
                        </div>
                    )}
                </Document>

                {/* Tap Zones for easier navigation */}
                <div className="absolute top-0 bottom-0 left-0 w-16 z-10 active:bg-black/5 transition-colors" onClick={() => changePage(-1)} />
                <div className="absolute top-0 bottom-0 right-0 w-16 z-10 active:bg-black/5 transition-colors" onClick={() => changePage(1)} />
            </div>

            {!loading && numPages && (
                <div className="flex items-center justify-between w-full max-w-md mt-6 px-4 pb-0">
                    <button
                        onClick={() => changePage(-1)}
                        disabled={pageNumber <= 1}
                        className="p-4 bg-white border border-gray-200 rounded-full shadow-lg disabled:opacity-30 disabled:shadow-none active:scale-95 transition-all text-gray-700 hover:text-primary hover:border-primary/30"
                    >
                        <ChevronLeftIcon className="w-6 h-6" />
                    </button>

                    <div className="flex flex-col items-center">
                        <span className="font-serif font-bold text-xl text-gray-900 tabular-nums">
                            {pageNumber} <span className="text-gray-400 text-sm font-normal">/ {numPages}</span>
                        </span>
                        <div className="flex items-center gap-2 mt-1">
                            <a
                                href={pdfUrl}
                                download="NLR-News-Calendar-2026.pdf"
                                className="text-[10px] uppercase tracking-wider font-bold text-gray-500 hover:text-primary transition-colors flex items-center gap-1"
                            >
                                <ArrowDownTrayIcon className="w-3 h-3" /> Download PDF
                            </a>
                            <span className="text-[10px] text-fuchsia-600 font-bold bg-fuchsia-50 px-2 py-0.5 rounded-full ring-1 ring-fuchsia-100 animate-pulse">v100.0 HYPER</span>
                        </div>
                    </div>

                    <button
                        onClick={() => changePage(1)}
                        disabled={pageNumber >= numPages}
                        className="p-4 bg-white border border-gray-200 rounded-full shadow-lg disabled:opacity-30 disabled:shadow-none active:scale-95 transition-all text-gray-700 hover:text-primary hover:border-primary/30"
                    >
                        <ChevronRightIcon className="w-6 h-6" />
                    </button>
                </div>
            )}
        </div>
    );
};
