import { useState, useEffect, useRef, useMemo } from 'react';
import { Document, Page, pdfjs } from 'react-pdf';
import { getBackendUrl } from '@/utils/getBackendUrl';
import { ChevronLeftIcon, ChevronRightIcon, ArrowDownTrayIcon, ArrowPathIcon, MagnifyingGlassMinusIcon, MagnifyingGlassPlusIcon, ArrowsPointingOutIcon } from '@heroicons/react/24/outline';
import 'react-pdf/dist/esm/Page/AnnotationLayer.css';
import 'react-pdf/dist/esm/Page/TextLayer.css';

// FIX: Use Reliable CDN worker to match React-PDF 9.x version.
pdfjs.GlobalWorkerOptions.workerSrc = `https://unpkg.com/pdfjs-dist@4.4.168/build/pdf.worker.min.mjs`;

import { TransformWrapper, TransformComponent } from "react-zoom-pan-pinch";

export const CalendarPDFViewerNew = () => {
    // Debug Log
    useEffect(() => { console.log("CalendarPDFViewerNew v1000.0 PINCH+SWIPE Loaded"); }, []);

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
        <div className="flex flex-col items-center w-full min-h-[500px] bg-gray-50/50 rounded-xl border border-gray-100 relative pb-20">
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

                                {/* Floating Zoom Controls (Visible when zoomed or on interaction) */}
                                <div className="absolute top-4 right-4 flex flex-col gap-2 z-20">
                                    <button onClick={() => zoomIn()} className="p-2 bg-black/50 backdrop-blur text-white rounded-full shadow-lg">
                                        <MagnifyingGlassPlusIcon className="w-5 h-5" />
                                    </button>
                                    <button onClick={() => zoomOut()} className="p-2 bg-black/50 backdrop-blur text-white rounded-full shadow-lg">
                                        <MagnifyingGlassMinusIcon className="w-5 h-5" />
                                    </button>
                                    <button onClick={() => resetTransform()} className="p-2 bg-black/50 backdrop-blur text-white rounded-full shadow-lg">
                                        <ArrowsPointingOutIcon className="w-5 h-5" />
                                    </button>
                                </div>
                            </div>
                        )}
                    </TransformWrapper>
                </Document>
            </div>

            {/* Professional Mobile Bottom Bar (Fixed) */}
            {!loading && numPages && (
                <div className="absolute bottom-4 left-4 right-4 bg-gray-900/90 backdrop-blur-md text-white rounded-2xl p-4 shadow-2xl flex items-center justify-between border border-white/10 z-30">
                    <button
                        onClick={() => changePage(-1)}
                        disabled={pageNumber <= 1}
                        className="p-3 bg-white/10 rounded-xl active:bg-white/20 transition-colors disabled:opacity-30"
                    >
                        <ChevronLeftIcon className="w-6 h-6" />
                    </button>

                    <div className="flex flex-col items-center">
                        <span className="font-bold text-lg font-serif tracking-wide">
                            Page {pageNumber} <span className="text-gray-400 text-sm font-normal">of {numPages}</span>
                        </span>
                        <a
                            href={pdfUrl}
                            download="NLR-News-Calendar-2026.pdf"
                            className="text-[10px] text-primary font-bold uppercase tracking-widest mt-0.5"
                        >
                            Download PDF
                        </a>
                    </div>

                    <button
                        onClick={() => changePage(1)}
                        disabled={pageNumber >= numPages}
                        className="p-3 bg-white/10 rounded-xl active:bg-white/20 transition-colors disabled:opacity-30"
                    >
                        <ChevronRightIcon className="w-6 h-6" />
                    </button>
                </div>
            )}
        </div>
    );
};
