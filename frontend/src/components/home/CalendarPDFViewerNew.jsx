import { useState, useEffect, useRef, useMemo } from 'react';
import { Document, Page, pdfjs } from 'react-pdf';
import { getBackendUrl } from '@/utils/getBackendUrl';
import { ChevronLeftIcon, ChevronRightIcon, ArrowDownTrayIcon, ArrowPathIcon } from '@heroicons/react/24/outline';
import { ChevronLeftIcon, ChevronRightIcon, ArrowDownTrayIcon, ArrowPathIcon, MagnifyingGlassMinusIcon, MagnifyingGlassPlusIcon, ArrowsPointingOutIcon } from '@heroicons/react/24/outline';
import 'react-pdf/dist/esm/Page/AnnotationLayer.css';
import 'react-pdf/dist/esm/Page/TextLayer.css';

// FIX: Use Reliable CDN worker to match React-PDF 9.x version.
pdfjs.GlobalWorkerOptions.workerSrc = `https://unpkg.com/pdfjs-dist@4.4.168/build/pdf.worker.min.mjs`;

export const CalendarPDFViewerNew = () => {
    // Debug Log
    useEffect(() => { console.log("CalendarPDFViewerNew v800.0 ZOOM+SWIPE Loaded"); }, []);

    const [numPages, setNumPages] = useState(null);
    const [pageNumber, setPageNumber] = useState(1);
    const [loading, setLoading] = useState(true);
    const [errorMsg, setErrorMsg] = useState(null);
    const [loadProgress, setLoadProgress] = useState(0);
    const [containerWidth, setContainerWidth] = useState(600);
    const [key, setKey] = useState(0);
    const [isPageLoaded, setIsPageLoaded] = useState(false); // Track if current page is done

    // Zoom State
    const [scale, setScale] = useState(1.0);
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
            setScale(1.0); // Reset zoom on page turn
        }
    };

    const handleRetry = () => {
        setLoading(true);
        setErrorMsg(null);
        setLoadProgress(0);
        setKey(prev => prev + 1);
        setScale(1.0);
    };

    // Zoom Handlers
    const zoomIn = () => setScale(prev => Math.min(prev + 0.5, 3.0));
    const zoomOut = () => setScale(prev => Math.max(prev - 0.5, 1.0));
    const zoomReset = () => setScale(1.0);

    // iOS Optimization: Cap pixelRatio at 1.0 for mobile to prevent Canvas OOM
    const isMobile = typeof window !== 'undefined' && window.innerWidth < 768;
    const pixelRatio = isMobile ? 1.0 : Math.min(window.devicePixelRatio, 1.5);

    return (
        <div className="flex flex-col items-center w-full min-h-[500px] bg-gray-50/50 rounded-xl border border-gray-100 relative">
            {/* Main Viewer Area */}
            <div className={`w-full bg-white rounded-lg shadow-sm border border-gray-100 overflow-hidden min-h-[500px] flex items-center justify-center relative touch-manipulation transition-colors duration-300 ${scale > 1 ? 'overflow-auto cursor-grab' : 'overflow-hidden'}`}>
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
                        <div className="flex flex-col items-center gap-6 p-10 text-center px-4 max-w-sm mx-auto">
                            <div className="w-16 h-16 bg-red-50 rounded-2xl flex items-center justify-center mb-2">
                                <ArrowDownTrayIcon className="w-8 h-8 text-red-500" />
                            </div>
                            <div>
                                <h3 className="text-lg font-bold text-gray-900 mb-2">Viewer Limitation</h3>
                                <p className="text-sm text-gray-500 leading-relaxed mb-4">
                                    Your device is optimizing memory. Tap below to view the calendar directly in your native viewer.
                                </p>
                            </div>

                            <a
                                href={pdfUrl}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="w-full py-3.5 bg-primary text-white rounded-xl text-sm font-bold shadow-lg shadow-red-100 flex items-center justify-center gap-2 hover:bg-red-700 transition-all active:scale-95"
                            >
                                <ArrowDownTrayIcon className="w-5 h-5" />
                                Open Calendar PDF
                            </a>

                            <button onClick={handleRetry} className="text-xs text-gray-400 font-medium hover:text-gray-600 underline">
                                Try Reloading Viewer
                            </button>
                        </div>
                    }
                    className="touch-pan-y"
                    options={options}
                    // Swipe Handling only when NOT zoomed
                    onTouchStart={(e) => {
                        if (scale === 1.0) {
                            touchStartX.current = e.changedTouches[0].screenX;
                        }
                    }}
                    onTouchEnd={(e) => {
                        if (scale === 1.0 && touchStartX.current) {
                            const touchEndX = e.changedTouches[0].screenX;
                            const diff = touchStartX.current - touchEndX;
                            if (Math.abs(diff) > 50) {
                                if (diff > 0 && pageNumber < numPages) changePage(1);
                                if (diff < 0 && pageNumber > 1) changePage(-1);
                            }
                            touchStartX.current = null;
                        }
                    }}
                >
                    {/* Main Page - Zoom via CSS Transform for Performance */}
                    <div
                        className="transform-gpu transition-transform duration-200 ease-out origin-top"
                        style={{ transform: `scale(${scale})` }}
                    >
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

                    {/* Pre-load NEXT page (Hidden) - Only if NOT Zoomed & Desktop */}
                    {!isMobile && scale === 1 && pageNumber < numPages && (
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

                    {/* DESKTOP ONLY: Pre-load NEXT+1 page */}
                    {!isMobile && scale === 1 && pageNumber + 1 < numPages && (
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

                    {/* DESKTOP ONLY: Pre-load PREVIOUS page */}
                    {!isMobile && scale === 1 && pageNumber > 1 && (
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

                {/* Tap Zones (Only active when NOT zoomed) */}
                {scale === 1 && (
                    <>
                        <div className="absolute top-0 bottom-0 left-0 w-12 z-10 active:bg-black/5 transition-colors" onClick={() => changePage(-1)} />
                        <div className="absolute top-0 bottom-0 right-0 w-12 z-10 active:bg-black/5 transition-colors" onClick={() => changePage(1)} />
                    </>
                )}
            </div>

            {/* Controls Bar */}
            {!loading && numPages && (
                <div className="w-full max-w-md px-4 pb-0 mt-4 space-y-4">
                    {/* Scale Controls */}
                    <div className="flex items-center justify-center gap-4 bg-white/80 backdrop-blur rounded-full px-6 py-2 shadow-sm border border-gray-100 mx-auto w-fit">
                        <button onClick={zoomOut} className="p-2 hover:bg-gray-100 rounded-full text-gray-600 disabled:opacity-30" disabled={scale <= 1}>
                            <MagnifyingGlassMinusIcon className="w-5 h-5" />
                        </button>
                        <span className="text-xs font-bold text-gray-500 w-8 text-center">{Math.round(scale * 100)}%</span>
                        <button onClick={zoomIn} className="p-2 hover:bg-gray-100 rounded-full text-gray-600 disabled:opacity-30" disabled={scale >= 3}>
                            <MagnifyingGlassPlusIcon className="w-5 h-5" />
                        </button>
                        <div className="w-px h-4 bg-gray-200 mx-1"></div>
                        <button onClick={zoomReset} className="text-[10px] font-bold text-primary uppercase tracking-wide hover:underline">
                            Reset
                        </button>
                    </div>

                    {/* Navigation Bar */}
                    <div className="flex items-center justify-between">
                        <button
                            onClick={() => changePage(-1)}
                            disabled={pageNumber <= 1}
                            className="p-4 bg-white border border-gray-200 rounded-full shadow-lg disabled:opacity-30 disabled:shadow-none active:scale-95 transition-all text-gray-700 hover:text-primary"
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
                                <span className="text-[10px] text-orange-600 font-bold bg-orange-50 px-2 py-0.5 rounded-full ring-1 ring-orange-100">v800.0 ZOOM</span>
                            </div>
                        </div>

                        <button
                            onClick={() => changePage(1)}
                            disabled={pageNumber >= numPages}
                            className="p-4 bg-white border border-gray-200 rounded-full shadow-lg disabled:opacity-30 disabled:shadow-none active:scale-95 transition-all text-gray-700 hover:text-primary"
                        >
                            <ChevronRightIcon className="w-6 h-6" />
                        </button>
                    </div>
                </div>
            )}
        </div>
    );
};
