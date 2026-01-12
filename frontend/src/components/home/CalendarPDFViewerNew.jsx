import { useState, useEffect, useRef, useMemo } from 'react';
import { Document, Page, pdfjs } from 'react-pdf';
import { getBackendUrl } from '@/utils/getBackendUrl';
import { ChevronLeftIcon, ChevronRightIcon, ArrowDownTrayIcon, ArrowPathIcon, MagnifyingGlassMinusIcon, MagnifyingGlassPlusIcon, ArrowsPointingOutIcon } from '@heroicons/react/24/outline';
import 'react-pdf/dist/esm/Page/AnnotationLayer.css';
import 'react-pdf/dist/esm/Page/TextLayer.css';

// FIX: Use LOCAL worker to avoid network/CORS issues.
pdfjs.GlobalWorkerOptions.workerSrc = `/pdf.worker.min.mjs`;

import { TransformWrapper, TransformComponent } from "react-zoom-pan-pinch";

export const CalendarPDFViewerNew = () => {
    // Debug Log
    useEffect(() => { console.log("CalendarPDFViewerNew v1300.0 STABLE RESTORE Loaded"); }, []);

    const [numPages, setNumPages] = useState(null);
    const [pageNumber, setPageNumber] = useState(1);
    const [loading, setLoading] = useState(true);
    const [errorMsg, setErrorMsg] = useState(null);
    const [loadProgress, setLoadProgress] = useState(0);
    const [containerWidth, setContainerWidth] = useState(600);
    const [key, setKey] = useState(0);
    const [isPageLoaded, setIsPageLoaded] = useState(false);

    // Swipe Refs
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
            setIsPageLoaded(false);
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
        <div
            className="flex flex-col items-center w-full min-h-[500px] bg-gray-50/50 rounded-xl border border-gray-100 relative pb-20 select-none"
            onContextMenu={(e) => e.preventDefault()} // Prevent iOS Long Press Menu
        >
            {/* Viewer Area */}
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
                        <div className="flex flex-col items-center gap-6 p-10 text-center px-4 max-w-sm mx-auto">
                            <div className="w-16 h-16 bg-red-50 rounded-2xl flex items-center justify-center mb-2">
                                <ArrowDownTrayIcon className="w-8 h-8 text-red-500" />
                            </div>
                            <div>
                                <h3 className="text-lg font-bold text-gray-900 mb-2">Viewer Limitation</h3>
                                <p className="text-sm text-gray-500 leading-relaxed mb-4">
                                    Tap below to open in native viewer.
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
                    options={options}
                >
                    {/* Pinch Zoom Wrapper */}
                    <TransformWrapper
                        initialScale={1}
                        minScale={1}
                        maxScale={4}
                        centerOnInit
                        onPanning={(ref, event) => {
                            // Allow swipe logic if needed, but react-zoom-pan-pinch handles panning
                        }}
                    >
                        {({ zoomIn, zoomOut, resetTransform, state }) => (
                            <div
                                onTouchStart={(e) => {
                                    // Only swipe if at scale 1
                                    if (state.scale === 1) {
                                        touchStartX.current = e.changedTouches[0].screenX;
                                    }
                                }}
                                onTouchEnd={(e) => {
                                    if (state.scale === 1 && touchStartX.current) {
                                        const touchEndX = e.changedTouches[0].screenX;
                                        const diff = touchStartX.current - touchEndX;
                                        if (Math.abs(diff) > 50) {
                                            if (diff > 0 && pageNumber < numPages) changePage(1);
                                            // Ensure we check limit before going back
                                            if (diff < 0 && pageNumber > 1) changePage(-1);
                                        }
                                        touchStartX.current = null;
                                    }
                                }}
                            >
                                <TransformComponent wrapperClass="!w-full !h-full" contentClass="!w-full !h-full flex justify-center">
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
                                </TransformComponent>

                                {/* Floating Zoom Controls (Transparent until interaction) */}
                                <div className="absolute top-20 right-4 flex flex-col gap-2 z-20 opacity-60 hover:opacity-100 transition-opacity">
                                    <button onClick={() => zoomIn()} className="p-2 bg-black/20 backdrop-blur-md border border-white/10 text-white rounded-full shadow-sm hover:bg-black/60 transition-colors">
                                        <MagnifyingGlassPlusIcon className="w-5 h-5" />
                                    </button>
                                    <button onClick={() => zoomOut()} className="p-2 bg-black/20 backdrop-blur-md border border-white/10 text-white rounded-full shadow-sm hover:bg-black/60 transition-colors">
                                        <MagnifyingGlassMinusIcon className="w-5 h-5" />
                                    </button>
                                    <button onClick={() => resetTransform()} className="p-2 bg-black/20 backdrop-blur-md border border-white/10 text-white rounded-full shadow-sm hover:bg-black/60 transition-colors">
                                        <ArrowsPointingOutIcon className="w-5 h-5" />
                                    </button>
                                </div>
                            </div>
                        )}
                    </TransformWrapper>
                </Document>
            </div>

            {/* Top Right Download Button (Transparent) */}
            {!loading && (
                <a
                    href={pdfUrl}
                    download="NLR-News-Calendar-2026.pdf"
                    className="absolute top-4 right-4 z-40 p-3 bg-white/30 backdrop-blur-md border border-white/20 rounded-full shadow-sm text-gray-700 hover:bg-white/90 hover:text-primary active:scale-95 transition-all opacity-70 hover:opacity-100"
                >
                    <ArrowDownTrayIcon className="w-5 h-5" />
                </a>
            )}

            {/* Modern Floating Navigation Pill (Transparent) */}
            {!loading && numPages && (
                <div className="absolute bottom-6 left-1/2 -translate-x-1/2 z-30 flex items-center gap-4 bg-white/60 backdrop-blur-sm border border-white/20 shadow-lg rounded-full px-2 py-2 pr-6 hover:bg-white/90 hover:shadow-2xl transition-all duration-300 group">
                    <button
                        onClick={() => changePage(-1)}
                        disabled={pageNumber <= 1}
                        className="w-10 h-10 flex items-center justify-center bg-white/50 hover:bg-white rounded-full text-gray-700 disabled:opacity-30 active:scale-90 transition-all shadow-sm"
                    >
                        <ChevronLeftIcon className="w-5 h-5" />
                    </button>

                    <div className="flex flex-col items-center min-w-[80px]">
                        <span className="font-bold text-gray-900 text-sm drop-shadow-sm">
                            {pageNumber} <span className="text-gray-600 font-normal">/ {numPages}</span>
                        </span>
                        <span className="text-[9px] text-fuchsia-600 font-bold uppercase tracking-wider opacity-60 group-hover:opacity-100 transition-opacity">
                            v1300.0 STABLE RESTORE
                        </span>
                    </div>

                    <button
                        onClick={() => changePage(1)}
                        disabled={pageNumber >= numPages}
                        className="w-10 h-10 flex items-center justify-center bg-black/80 text-white hover:bg-black rounded-full shadow-lg disabled:opacity-30 disabled:shadow-none active:scale-90 transition-all"
                    >
                        <ChevronRightIcon className="w-5 h-5" />
                    </button>
                </div>
            )}
        </div>
    );
};
