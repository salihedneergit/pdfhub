
import React from 'react';

const PdfViewer = ({ fileUrl }) => (

  <div className="pdf-viewer" style={{ height: '100vh', width: '100%' }}>
    <iframe
      src={fileUrl}
      title="PDF Viewer"
      width="100%"
      height="100%"
      style={{ border: 'none' }}
    />
  </div>
);

export default PdfViewer;
