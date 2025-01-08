const express = require('express');
const multer = require('multer');
const authMiddleware = require('../middleware/authMiddleware.js');
const { uploadFile, generateSignedUrl, deleteFile,listFiles,renamePdf } = require('../models/s3Services.js');
const Course = require('../models/Course');
const router = express.Router();
const upload = multer();
const axios = require('axios');

// Upload a PDF
router.post('/upload-pdf', upload.single('file'), async (req, res) => {
    try {
        // Get the custom name from the body, default to the original name if not provided
        const fileName = req.body.name + ".pdf"|| req.file.originalname+".pdf";

        // Call uploadFile function with the file and the user-defined name
        await uploadFile(req.file, fileName);

        res.status(200).send('File uploaded successfully');
    } catch (err) {
        res.status(500).send('Error uploading file: ' + err.message);
    }
});

// List PDFs
router.get('/list-pdfs', async (req, res) => {
    try {
        const files = await listFiles();
        res.json(files);
    } catch (err) {
        res.status(500).send('Error fetching files');
    }
});

// Generate signed URL to view a PDF
router.get('/view-pdf', authMiddleware, (req, res) => {
    const { key } = req.query;
    const signedUrl = generateSignedUrl(key);
    res.json({ url: signedUrl });
});

router.delete('/delete-pdf', authMiddleware, async (req, res) => {
    const { key } = req.query;
  
    if (!key) {
      return res.status(400).send('File key is required');
    }
  
    try {
      // Step 1: Delete the file from S3 bucket
      await deleteFile(key);
      
      // Step 2: Remove the PDF from all courses (from all modules/folders where it is referenced)
      await Course.updateMany(
        { "folders.pdfs": key },  // Find courses where the PDF is referenced
        { $pull: { "folders.$[].pdfs": key } } // Remove the PDF from the 'pdfs' array in all folders (not just the first folder)
      );
  
      res.status(200).send('File and references deleted successfully');
    } catch (err) {
      res.status(500).send(`Error deleting file and cleaning up references: ${err.message}`);
    }
  });


// In your routes file
router.get('/proxy-pdf', async (req, res) => {
    try {
        // Verify auth header
        const authHeader = req.headers['x-custom-auth'];
        if (authHeader !== 'MY_SECRET_HEADER_KEY') {
            return res.status(401).json({ error: 'Unauthorized' });
        }

        const { url } = req.query;
        if (!url) {
            return res.status(400).json({ error: 'URL parameter is required' });
        }

        // Fetch the PDF
        const response = await axios.get(url, {
            responseType: 'arraybuffer'
        });

        // Set appropriate headers
        res.setHeader('Content-Type', 'application/pdf');
        res.setHeader('Content-Disposition', 'inline');
        res.setHeader('Access-Control-Allow-Origin', 'http://localhost:3001');
        res.setHeader('Access-Control-Allow-Headers', 'x-custom-auth');

        // Send the PDF data
        res.send(response.data);
    } catch (error) {
        console.error('Error proxying PDF:', error);
        res.status(500).json({ error: 'Failed to proxy PDF' });
    }
});

module.exports = router;
