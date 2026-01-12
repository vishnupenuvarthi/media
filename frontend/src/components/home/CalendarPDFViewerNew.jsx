import { useState, useEffect, useRef, useMemo } from 'react';
import { Document, Page, pdfjs } from 'react-pdf';
import { getBackendUrl } from '@/utils/getBackendUrl';
import { ChevronLeftIcon, ChevronRightIcon, ArrowDownTrayIcon, MagnifyingGlassMinusIcon, MagnifyingGlassPlusIcon, ArrowsPointingOutIcon } from '@heroicons/react/24/outline';
import 'react-pdf/dist/esm/Page/AnnotationLayer.css';
import 'react-pdf/dist/esm/Page/TextLayer.css';

// FIX: Use LOCAL worker to avoid network/CORS issues.
pdfjs.GlobalWorkerOptions.workerSrc = `/pdf.worker.min.mjs`;

import { TransformWrapper, TransformComponent } from "react-zoom-pan-pinch";

// Slide Animation Styles
const slideStyles = `
@keyframes slideInRight {
  from { transform: translateX(100%); opacity: 0; }
  to { transform: translateX(0); opacity: 1; }
}
@keyframes slideInLeft {
  from { transform: translateX(-100%); opacity: 0; }
  to { transform: translateX(0); opacity: 1; }
}
.animate-slide-right { animation: slideInRight 0.3s cubic-bezier(0.4, 0, 0.2, 1) forwards; }
.animate-slide-left { animation: slideInLeft 0.3s cubic-bezier(0.4, 0, 0.2, 1) forwards; }
`;

export const CalendarPDFViewerNew = () => {
    // Debug Log
    useEffect(() => { console.log("CalendarPDFViewerNew v1500.0 FINAL POLISH Loaded"); }, []);

    const [numPages, setNumPages] = useState(null);
    const [pageNumber, setPageNumber] = useState(1);
    const [loading, setLoading] = useState(true);
    const [loadProgress, setLoadProgress] = useState(0);
    const [containerWidth, setContainerWidth] = useState(600);
    const [key, setKey] = useState(0);
    const [slideDirection, setSlideDirection] = useState('right'); // 'right' or 'left'
    const [scale, setScale] = useState(1); // Track scale to toggle panning

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
            setSlideDirection(offset > 0 ? 'right' : 'left');
            // Small delay to reset animation class if needed, but key change handles it
            setPageNumber(newPage);
        }
    };

    const handleRetry = () => {
        setLoading(true);
        setLoadProgress(0);
        setKey(prev => prev + 1);
        setScale(1);
    };

    // iOS Optimization: Cap pixelRatio at 1.0 for mobile to prevent Canvas OOM
    const isMobile = typeof window !== 'undefined' && window.innerWidth < 768;
    const pixelRatio = isMobile ? 1.0 : Math.min(window.devicePixelRatio, 1.5);

    return (
        <div
            className="flex flex-col items-center w-full min-h-[500px] bg-gray-50/50 rounded-xl border border-gray-100 relative pb-4 select-none overflow-hidden"
            onContextMenu={(e) => e.preventDefault()}
        >
            <style>{slideStyles}</style>

            {/* Viewer Area */}
            <div
                className={`w-full bg-white rounded-lg shadow-sm border border-gray-100 overflow-hidden min-h-[500px] flex items-center justify-center relative touch-manipulation custom-scrollbar ${scale === 1 ? 'touch-pan-y' : 'touch-none'}`}
                style={{ touchAction: scale === 1 ? 'pan-y' : 'none' }}
            >
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
                        onTransformed={(ref) => setScale(ref.state.scale)} // Track Scale
                        panning={{ disabled: scale === 1 }} // Disable panning if unzoomed to allow native scroll
                        wheel={{ disabled: true }} // Disable mouse wheel zoom to allow page scroll
                        doubleClick={{ disabled: true }}
                        onPanning={(ref, event) => {
                            // Allow swipe logic if needed, but react-zoom-pan-pinch handles panning
                        }}
                    >
                        {({ zoomIn, zoomOut, resetTransform, state }) => (
                            <div
                                onTouchStart={(e) => {
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
                                            if (diff < 0 && pageNumber > 1) changePage(-1);
                                        }
                                        touchStartX.current = null;
                                    }
                                }}
                                className={`w-full h-full flex justify-center ${slideDirection === 'right' ? 'animate-slide-right' : 'animate-slide-left'}`}
                                key={pageNumber} // Force re-render for animation
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
                                    />
                                </TransformComponent>

                                {/* Floating Zoom Controls */}
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

                {/* SIDE NAVIGATION (Carousel Style) */}
                {!loading && numPages && (
                    <>
                        {/* LEFT NAV */}
                        <button
                            onClick={() => changePage(-1)}
                            disabled={pageNumber <= 1}
                            className={`absolute left-2 top-1/2 -translate-y-1/2 z-30 p-3 rounded-full transition-all duration-300 ${pageNumber <= 1 ? 'opacity-0 pointer-events-none' : 'bg-white/40 backdrop-blur-md hover:bg-white/80 shadow-lg text-gray-800'}`}
                        >
                            <ChevronLeftIcon className="w-6 h-6" />
                        </button>

                        {/* RIGHT NAV */}
                        <button
                            onClick={() => changePage(1)}
                            disabled={pageNumber >= numPages}
                            className={`absolute right-2 top-1/2 -translate-y-1/2 z-30 p-3 rounded-full transition-all duration-300 ${pageNumber >= numPages ? 'opacity-0 pointer-events-none' : 'bg-white/40 backdrop-blur-md hover:bg-white/80 shadow-lg text-gray-800'}`}
                        >
                            <ChevronRightIcon className="w-6 h-6" />
                        </button>
                    </>
                )}
            </div>

            {/* Bottom Floating Control Dock */}
            {!loading && numPages && (
                <div className="absolute bottom-6 left-1/2 -translate-x-1/2 z-30 flex items-center gap-4 bg-gray-900/80 backdrop-blur-md text-white rounded-full px-6 py-3 shadow-2xl border border-white/10 transition-all hover:bg-gray-900/90 hover:scale-105">
                    <span className="font-serif text-sm tracking-widest text-gray-300 border-r border-white/20 pr-4 mr-1">
                        {pageNumber} <span className="text-gray-500">/</span> {numPages}
                    </span>

                    <a
                        href={pdfUrl}
                        download="NLR-News-Calendar-2026.pdf"
                        className="flex items-center gap-2 text-white hover:text-primary transition-colors group"
                    >
                        <div className="p-1 bg-white/10 rounded-full group-hover:bg-primary group-hover:text-white transition-colors">
                            <ArrowDownTrayIcon className="w-4 h-4" />
                        </div>
                        <span className="text-xs font-bold uppercase tracking-wider">Download</span>
                    </a>
                </div>
            )}
        </div>
    );
};
