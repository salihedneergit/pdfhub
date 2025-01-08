import React, { useState, useEffect } from "react";
import axios from "axios";
import { FilePlus, X, Trash, Eye, Upload, Check, Loader2 } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { toast, Toaster } from "react-hot-toast";

import PDFIcon from '../../../assets/icons/PDFICON.png'

const PdfViewer = ({ fileUrl, onClose }) => {
  const [loading, setLoading] = useState(true);

  return (
    <motion.div 
      initial={{ opacity: 0 }} 
      animate={{ opacity: 1 }} 
      exit={{ opacity: 0 }}
      className="fixed inset-0 bg-black z-50"
    >
      <button
        onClick={onClose}
        className="absolute top-4 right-4 z-10 bg-red-500 text-white p-2 rounded-full hover:bg-red-600 transition-colors"
        aria-label="Close viewer"
      >
        <X size={24} />
      </button>
      
      <AnimatePresence>
        {loading && (
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="absolute inset-0 flex items-center justify-center bg-gray-900"
          >
            <Loader2 className="w-12 h-12 text-[#4318ffd9] animate-spin" />
          </motion.div>
        )}
      </AnimatePresence>

      <iframe
        src={fileUrl}
        title="PDF Viewer"
        className="w-full h-full"
        style={{ border: 'none' }}
        onLoad={() => setLoading(false)}
      />
    </motion.div>
  );
};

// Skeleton Loader Component
const SkeletonLoader = () => (
  <div className="animate-pulse space-y-3">
    {[1, 2, 3].map((i) => (
      <div key={i} className="flex justify-between items-center p-3 bg-gray-100 rounded-md">
        <div className="h-4 bg-gray-200 rounded w-3/4"></div>
        <div className="flex space-x-2">
          <div className="h-5 w-5 bg-gray-200 rounded"></div>
          <div className="h-5 w-5 bg-gray-200 rounded"></div>
        </div>
      </div>
    ))}
  </div>
);

// Upload Progress Component
const UploadProgress = ({ progress, completed }) => (
  <div className="text-center py-8 space-y-6">
    {completed ? (
      <motion.div
        initial={{ scale: 0 }}
        animate={{ scale: 1 }}
        className="flex flex-col items-center space-y-4"
      >
        <div className="text-green-500">
          <Check size={48} />
        </div>
        <p className="text-lg font-medium">Upload Complete!</p>
      </motion.div>
    ) : (
      <>
        <div className="w-24 h-24 mx-auto relative">
          <svg className="w-full h-full" viewBox="0 0 100 100">
            <circle
              className="text-gray-200"
              strokeWidth="8"
              stroke="currentColor"
              fill="transparent"
              r="42"
              cx="50"
              cy="50"
            />
            <circle
              className="text-[#4318ffd9] transition-all duration-300"
              strokeWidth="8"
              strokeLinecap="round"
              stroke="currentColor"
              fill="transparent"
              r="42"
              cx="50"
              cy="50"
              strokeDasharray={`${progress * 2.64}, 264`}
              transform="rotate(-90 50 50)"
            />
          </svg>
          <div className="absolute inset-0 flex items-center justify-center">
            <span className="text-xl font-semibold">{progress}%</span>
          </div>
        </div>
        <p className="text-gray-600">Uploading your PDF...</p>
      </>
    )}
  </div>
);

// Main Component
const UploadPdfManager = () => {
  const [pdfList, setPdfList] = useState([]);
  const [pdfUrl, setPdfUrl] = useState(null);
  const [selectedFile, setSelectedFile] = useState(null);
  const [pdfName, setPdfName] = useState("");
  const [uploadProgress, setUploadProgress] = useState(0);
  const [showUploadPopup, setShowUploadPopup] = useState(false);
  const [showViewer, setShowViewer] = useState(false);
  const [isUploading, setIsUploading] = useState(false);
  const [loading, setLoading] = useState(true);
  const [isDragging, setIsDragging] = useState(false);
  const [uploadComplete, setUploadComplete] = useState(false);

  const [searchQuery, setSearchQuery] = useState("");


  // VIEW PDF
  const loadPdf = async (key) => {
    try {
      const { data } = await axios.get(
        `http://localhost:3001/api/pdf/view-pdf?key=${key}`,
        {
          headers: { "x-custom-auth": "MY_SECRET_HEADER_KEY" },
        }
      );
      setPdfUrl(data.url);
      setShowViewer(true);
    } catch (error) {
      console.error("Error loading PDF:", error);
    }
  };

  // DELETE PDF
  const deletePdf = async (key) => {
    try {
      await axios.delete(`http://localhost:3001/api/pdf/delete-pdf?key=${key}`, {
        headers: { "x-custom-auth": "MY_SECRET_HEADER_KEY" },
      });
      fetchPdfs();
      toast.success("File removed")
    } catch (error) {
      toast.error("Error occured")
      console.error("Error deleting PDF:", error);
    }
  };

  useEffect(() => {
    fetchPdfs();
  }, []);


  // Fetch existing PDFs
  const fetchPdfs = async () => {
    try {
      const { data } = await axios.get("http://localhost:3001/api/pdf/list-pdfs");
      setPdfList(data);
      setLoading(false);
    } catch (error) {
      console.error("Failed to fetch PDFs");
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPdfs();
  }, []);

  // Handle file selection
  const handleFileSelect = (file) => {
    if (file && file.type === "application/pdf") {
      setSelectedFile(file);
    } else {
      console.error("Please select a valid PDF file");
    }
  };

  // Handle drag and drop
  const handleDragOver = (e) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = (e) => {
    e.preventDefault();
    setIsDragging(false);
  };

  const handleDrop = (e) => {
    e.preventDefault();
    setIsDragging(false);
    const file = e.dataTransfer.files[0];
    handleFileSelect(file);
  };

  // Upload PDF
  const uploadPdf = async () => {
    if (!selectedFile || !pdfName) return;
    
    const formData = new FormData();
    formData.append("file", selectedFile);
    formData.append("name", pdfName);
    
    setIsUploading(true);
    setUploadComplete(false);

    try {
      await axios.post("http://localhost:3001/api/pdf/upload-pdf", formData, {
        onUploadProgress: (progressEvent) => {
          const percent = Math.round((progressEvent.loaded * 100) / progressEvent.total);
          setUploadProgress(percent);
        },
      });

      setUploadComplete(true);
      toast.success("Upload complete")
      
      setTimeout(() => {
        setIsUploading(false);
        setSelectedFile(null);
        setPdfName("");
        setUploadProgress(0);
        setShowUploadPopup(false);
        fetchPdfs();
      }, 1000);
    } catch (error) {
      toast.error("Upload failed")
      console.error("Upload failed");
      setIsUploading(false);
    }
  };

  return (
    <>
      <div className="relative">
        {/* Main Content with Blur Effect */}
        <div
          className={`p-4 md:p-6 max-w-screen-lg mx-auto transition-all ${
            showUploadPopup ? "blur-sm pointer-events-none" : ""
          }`}
        >
          <div className="flex justify-between items-center mb-6">
            <h1 className="text-xl md:text-2xl font-semibold text-gray-800">Manage PDFs</h1>
            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              onClick={() => setShowUploadPopup(true)}
              className="px-4 py-2 bg-[#4318ffd9] text-white rounded-lg shadow-md hover:bg-blue-700 transition-colors flex items-center space-x-2"
            >
              <Upload size={20} />
              <span>Upload PDF</span>
            </motion.button>
          </div>

          {/* SEARCH BAR*/}
        

          <div className="mt-5 mb-5">
  <input
    type="text"
    placeholder="Search PDFs..."
    onChange={(e) => setSearchQuery(e.target.value)}
    className="w-full p-3 border rounded-lg focus:ring-2 focus:ring-[#4318ffd9] focus:border-[#4318ffd9] outline-none"
  />
</div>
  
          {/* PDF List */}
          <div className="p-4 border rounded-lg shadow-md bg-white">
            {loading ? (
              <SkeletonLoader />
            ) : (
              <AnimatePresence>
                {pdfList.length > 0 ? (
                  <motion.ul 
                    className="space-y-3"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                  >
                    {pdfList
  .filter((pdf) => pdf.toLowerCase().includes(searchQuery.toLowerCase()))
  .map((pdf, index) => (
    <motion.li
      key={pdf}
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      transition={{ delay: index * 0.1 }}
      className="flex justify-between items-center p-3 bg-gray-50 rounded-md hover:bg-gray-100 transition-colors"
    >
      <img src={PDFIcon} alt="PDF" className="w-8 h-10 m-3" />
      <span className="truncate flex-1 mr-4">{pdf}</span>
      <div className="flex space-x-2">
        <motion.button
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.9 }}
          onClick={() => loadPdf(pdf)}
          className="text-[#4318ffd9] hover:text-blue-800 transition-colors p-1"
        >
          <Eye size={20} />
        </motion.button>
        <motion.button
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.9 }}
          onClick={() => deletePdf(pdf)}
          className="text-red-500 hover:text-red-700 transition-colors p-1"
        >
          <Trash size={20} />
        </motion.button>
      </div>
    </motion.li>
  ))}

                  </motion.ul>
                ) : (
                  <motion.p
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    className="text-center text-gray-500"
                  >
                    No PDFs available.
                  </motion.p>
                )}
              </AnimatePresence>
            )}
          </div>
        </div>
  
        {/* Upload Modal */}
        <AnimatePresence>
          {showUploadPopup && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50 p-4"
            >
              <motion.div
                initial={{ scale: 0.9, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                exit={{ scale: 0.9, opacity: 0 }}
                className="relative bg-white rounded-xl shadow-xl w-full max-w-xl p-6"
              >
                <button
                  onClick={() => !isUploading && setShowUploadPopup(false)}
                  className="absolute top-4 right-4 text-gray-500 hover:text-gray-800 transition-colors"
                  disabled={isUploading}
                >
                  <X size={20} />
                </button>
  
                {isUploading ? (
                  <UploadProgress progress={uploadProgress} completed={uploadComplete} />
                ) : (
                  <div className="text-center space-y-6">
                    <h2 className="text-2xl font-semibold text-gray-800">Upload PDF</h2>
                    {!selectedFile ? (
                      <label
                        onDragOver={handleDragOver}
                        onDragLeave={handleDragLeave}
                        onDrop={handleDrop}
                        htmlFor="file-upload"
                        className={`block border-2 border-dashed rounded-lg p-8 cursor-pointer transition-colors ${
                          isDragging ? 'border-[#4318ffd9] bg-blue-50' : 'border-gray-300 hover:border-[#4318ffd9]'
                        }`}
                      >
                        <div className="space-y-4">
                          <motion.div
                            animate={{ scale: isDragging ? 1.1 : 1 }}
                            className="text-[#4318ffd9]"
                          >
                            <FilePlus size={48} className="mx-auto" />
                          </motion.div>
                          <div>
                            <p className="text-lg font-medium text-gray-700">
                              {isDragging ? 'Drop your PDF here' : 'Click to select a PDF'}
                            </p>
                            <p className="text-sm text-gray-500 mt-1">or drag and drop here</p>
                          </div>
                        </div>
                        <input
                          type="file"
                          className="hidden"
                          id="file-upload"
                          accept=".pdf"
                          onChange={(e) => handleFileSelect(e.target.files[0])}
                        />
                      </label>
                    ) : (
                      <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="space-y-4"
                      >
                        <div className="p-4 bg-gray-50 rounded-lg">
                          <p className="font-medium text-gray-700">{selectedFile.name}</p>
                          <p className="text-sm text-gray-500">
                            {(selectedFile.size / 1024 / 1024).toFixed(2)} MB
                          </p>
                        </div>
                        <input
                          type="text"
                          value={pdfName}
                          onChange={(e) => setPdfName(e.target.value)}
                          placeholder="Enter PDF name"
                          className="w-full p-3 border rounded-lg focus:ring-2 focus:ring-[#4318ffd9] focus:border-[#4318ffd9] outline-none"
                        />
                        <motion.button
                          whileHover={{ scale: 1.02 }}
                          whileTap={{ scale: 0.98 }}
                          onClick={uploadPdf}
                          disabled={!pdfName}
                          className="w-full py-3 bg-[#4318ffd9] text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors flex items-center justify-center space-x-2"
                        >
                          <Upload size={20} />
                          <span>Upload PDF</span>
                        </motion.button>
                        <button
                          onClick={() => {
                            setSelectedFile(null);
                            setPdfName("");
                          }}
                          className="w-full py-2 text-gray-600 hover:text-gray-800 transition-colors"
                        >
                          Cancel
                        </button>
                      </motion.div>
                    )}
                  </div>
                )}
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>
  
        {/* PDF Viewer */}
        <AnimatePresence>
          {showViewer && pdfUrl && (
            <PdfViewer 
              fileUrl={pdfUrl} 
              onClose={() => {
                setShowViewer(false);
                setPdfUrl(null);
              }}
            />
          )}
        </AnimatePresence>
      </div>
      <Toaster />
    </>
  );
}
  

export default UploadPdfManager;
