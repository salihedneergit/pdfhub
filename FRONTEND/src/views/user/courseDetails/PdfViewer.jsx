import React, { useEffect, useState, useRef } from 'react';
import { Worker, Viewer, SpecialZoomLevel } from '@react-pdf-viewer/core';
import { zoomPlugin, ZoomInButton, ZoomOutButton, ZoomPopover } from '@react-pdf-viewer/zoom';
import { Maximize2, Minimize2, Loader2 } from 'lucide-react';
import '@react-pdf-viewer/core/lib/styles/index.css';
import '@react-pdf-viewer/zoom/lib/styles/index.css';
import axios from 'axios';

const PdfViewer = ({ pdfKey }) => {
    const [pdfUrl, setPdfUrl] = useState(null);
    const [loading, setLoading] = useState(true);
    const [isFullScreen, setIsFullScreen] = useState(false);
    const [userEmail, setUserEmail] = useState('');
    const viewerContainerRef = useRef(null);

    useEffect(() => {
    
        const userData = JSON.parse(localStorage.getItem('user') || '{}');
        setUserEmail(userData.email || '');
    }, []);

    useEffect(() => {
        if (!pdfKey) return;

        setLoading(true);
        let timeoutId;

        const loadPdf = async () => {
            try {
                const { data: urlData } = await axios.get(
                    `http://13.51.106.41:3001/api/pdf/view-pdf?key=${pdfKey}`,
                    { headers: { 'x-custom-auth': 'MY_SECRET_HEADER_KEY' } }
                );

                const response = await axios.get(
                    `http://13.51.106.41:3001/api/pdf/proxy-pdf?url=${encodeURIComponent(urlData.url)}`,
                    {
                        responseType: 'arraybuffer',
                        headers: { 'x-custom-auth': 'MY_SECRET_HEADER_KEY' },
                    }
                );

                const blob = new Blob([response.data], { type: 'application/pdf' });
                const url = URL.createObjectURL(blob);

                timeoutId = setTimeout(() => {
                    setPdfUrl(url);
                    setLoading(false);
                }, 800);
            } catch (error) {
                console.error('Error loading PDF:', error);
                setLoading(false);
            }
        };

        loadPdf();

        return () => {
            clearTimeout(timeoutId);
            if (pdfUrl) URL.revokeObjectURL(pdfUrl);
        };
    }, [pdfKey]);

    const toggleFullScreen = () => {
        if (!viewerContainerRef.current) return;

        if (!document.fullscreenElement) {
            viewerContainerRef.current.requestFullscreen();
            setIsFullScreen(true);
        } else {
            if (document.exitFullscreen) {
                document.exitFullscreen();
                setIsFullScreen(false);
            }
        }
    };

    const zoomPluginInstance = zoomPlugin();
    const { ZoomInButton, ZoomOutButton, ZoomPopover } = zoomPluginInstance;

    // Prevent printing, right-click, and common export methods
    useEffect(() => {
        const style = document.createElement('style');
        style.textContent = `
            @media print { 
                body { display: none !important; } 
            }
            ::selection {
                background: transparent;
            }
        `;
        document.head.appendChild(style);

        const preventDefaultAction = (e) => e.preventDefault();

        const preventKeyboardShortcuts = (e) => {
            if (
                (e.ctrlKey || e.metaKey) &&
                ['p', 's', 'c', 'x', 'v', 'a'].includes(e.key.toLowerCase())
            ) {
                e.preventDefault();
            }
        };

        const blockContextMenu = (e) => {
            e.preventDefault();
        };

        window.addEventListener('keydown', preventKeyboardShortcuts);
        document.addEventListener('contextmenu', blockContextMenu);
        document.addEventListener('copy', preventDefaultAction);
        document.addEventListener('selectstart', preventDefaultAction);
        document.addEventListener('dragstart', preventDefaultAction);

        return () => {
            document.head.removeChild(style);
            window.removeEventListener('keydown', preventKeyboardShortcuts);
            document.removeEventListener('contextmenu', blockContextMenu);
            document.removeEventListener('copy', preventDefaultAction);
            document.removeEventListener('selectstart', preventDefaultAction);
            document.removeEventListener('dragstart', preventDefaultAction);
        };
    }, []);

    if (loading) {
        return (
            <div className="flex items-center justify-center h-full bg-white rounded-lg">
                <div className="text-center">
                    <Loader2 className="w-8 h-8 animate-spin text-blue-500 mx-auto mb-4" />
                    <p className="text-gray-600">Loading PDF...</p>
                </div>
            </div>
        );
    }

    return (
        <div ref={viewerContainerRef} className="relative h-full bg-white rounded-lg overflow-hidden">
            {/* Fullscreen toggle */}
            <button
                onClick={toggleFullScreen}
                className="absolute top-4 right-4 z-50 p-2 bg-white rounded-lg shadow-md hover:bg-gray-50 transition-colors"
            >
                {isFullScreen ? <Minimize2 size={20} /> : <Maximize2 size={20} />}
            </button>

            {/* Watermark Overlay */}
            <div
                className="absolute inset-0 pointer-events-none z-10"
                style={{
                    display: 'grid',
                    gridTemplateColumns: 'repeat(auto-fill, 200px)',
                    gridTemplateRows: 'repeat(auto-fill, 100px)',
                    opacity: 0.15,
                }}
            >
                {Array.from({ length: 50 }).map((_, index) => (
                    <div
                        key={index}
                        style={{
                            transform: 'rotate(-45deg)',
                            fontSize: '15px',
                            fontWeight: '500',
                            color: '#C0C0C0',
                            textTransform: 'uppercase',
                            whiteSpace: 'nowrap',
                            userSelect: 'none',
                            pointerEvents: 'none',
                            fontFamily: 'system-ui, sans-serif',
                            textAlign: 'center',
                        }}
                    >
                        {userEmail || 'Watermark Text'}
                    </div>
                ))}
            </div>

            {/* PDF Viewer */}
            <div className="h-full p-2.5">
                <Worker workerUrl="https://unpkg.com/pdfjs-dist@3.11.174/build/pdf.worker.min.js">
                    <div className="flex items-center justify-between mb-2">
                        <ZoomOutButton />
                        <ZoomPopover />
                        <ZoomInButton />
                    </div>
                    <Viewer
                        fileUrl={pdfUrl}
                        defaultScale={SpecialZoomLevel.PageFit}
                        plugins={[zoomPluginInstance]}
                    />
                </Worker>
            </div>
        </div>
    );
};

export default PdfViewer;
