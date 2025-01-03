// Revised quizRoutes.js
import express from 'express';
import dotenv from 'dotenv'
import { ObjectId } from 'mongodb';
import pdfParse from 'pdf-parse';
import mammoth from 'mammoth';
import { GoogleGenerativeAI } from '@google/generative-ai';
import { PDFDocument } from 'pdf-lib';
import { getDocument } from 'pdfjs-dist';
dotenv.config();

const router = express.Router();
const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);
const model = genAI.getGenerativeModel({ model: 'gemini-1.5-flash' });

const fetchFileFromGridFS = async (gfsBucket, fileId) => {
  return new Promise((resolve, reject) => {
    const readStream = gfsBucket.openDownloadStream(new ObjectId(fileId));
    const chunks = [];

    readStream.on('data', (chunk) => {
      chunks.push(chunk); // Collect binary chunks
    });

    readStream.on('end', () => {
      const fileBuffer = Buffer.concat(chunks); // Combine chunks into a single buffer
      console.log(`Fetched file data length: ${fileBuffer.length}`); // Log the buffer size
      if (fileBuffer.length === 0) {
        console.error('Fetched file data is empty');
      }
      resolve(fileBuffer); // Return the buffer
    });

    readStream.on('error', (err) => {
      console.error('Error fetching file from GridFS:', err.message);
      reject(err);
    });
  });
};

const preprocessPDF = async (data) => {
  try {
    const buffer = Buffer.from(data, 'utf-8');
    const pdfDoc = await PDFDocument.load(buffer);
    const fixedPDF = await pdfDoc.save();

    console.log('Preprocessed PDF successfully.');
    return fixedPDF;
  } catch (error) {
    console.error('Error preprocessing PDF:', error.message);
    throw error; // Handle as needed
  }
};

const extractTextFromPDF = async (data) => {
  try {
    // Convert Buffer to Uint8Array
    const uint8ArrayData = new Uint8Array(data);

    console.log('Parsing PDF...');
    const pdf = await getDocument(uint8ArrayData).promise;

    let text = '';
    for (let i = 1; i <= pdf.numPages; i++) {
      const page = await pdf.getPage(i);
      const content = await page.getTextContent();
      const pageText = content.items.map((item) => item.str).join(' ');
      text += ` ${pageText}`;
    }

    console.log('PDF text extraction complete.');
    console.log('Extracted PDF Text:', text.slice(0, 500)); // Log the first 500 characters for debugging
    return text.trim();
  } catch (error) {
    console.error('Error extracting text from PDF using pdfjs-dist:', error.message);
    return ''; // Handle error gracefully
  }
};

const extractTextFromDOCX = async (data) => {
  const buffer = Buffer.from(data, 'utf-8');
  const result = await mammoth.extractRawText({ buffer });
  return result.value;
};

const generateQuiz = async (text) => {
  const prompt = `You are an expert quiz creator. Based on the following text, generate a set of quiz questions and answers. Each question should be a separate array element. Do not format the questions or answers with any special characters. Here is the text:\n\n${text}`;
  console.log('Sending prompt to Gemini AI...');

  try {
    const result = await model.generateContent(prompt);

    console.log('Received response from Gemini AI:', result); // Log the full response for debugging

    if (result.response && result.response.candidates) {
      const quizContent = result.response.candidates[0].content.parts[0].text;
      console.log('Quiz content extracted from Gemini AI:', quizContent); // Log the quiz content

      const cleanedContent = cleanMarkdownFormatting(quizContent);
      return cleanGeminiResponse(cleanedContent);
    } else {
      throw new Error('Failed to generate quiz questions. Unexpected Gemini AI response.');
    }
  } catch (error) {
    console.error('Error in generateQuiz:', error.message);
    throw error;
  }
};

const cleanMarkdownFormatting = (content) => {
  return content.replace(/```[a-zA-Z0-9]*\n/g, '').replace(/```/g, '');
};

const cleanGeminiResponse = (response) => {
  if (typeof response !== 'string') {
    console.error('Unexpected response format: Expected a string.');
    return [];
  }

  const cleanedResponse = response
    .replace(/[\[\]'\"`,]/g, '')
    .replace(/\n+/g, '\n')
    .trim();

  const questionAnswerPairs = [];
  const lines = cleanedResponse.split('\n');

  for (let i = 0; i < lines.length; i += 2) {
    if (lines[i + 1]) {
      questionAnswerPairs.push({
        question: lines[i].trim(),
        answer: lines[i + 1].trim(),
      });
    }
  }

  console.log('Cleaned quiz questions:', questionAnswerPairs);
  return questionAnswerPairs;
};

router.post('/generate-quiz', async (req, res) => {
  const { fileId, fileType } = req.body;

  if (!fileId || !fileType) {
    return res.status(400).json({ error: 'File ID and type are required to generate a quiz.' });
  }

  try {
    const gfsBucket = req.app.locals.gfsBucket;

    if (!gfsBucket) {
      console.error('GridFSBucket is not initialized');
      return res.status(500).json({ error: 'GridFSBucket is not initialized.' });
    }

    console.log(`Fetching file from GridFS with ID: ${fileId}`);
    const fileData = await fetchFileFromGridFS(gfsBucket, fileId);

    let text = '';
    if (fileType === 'pdf') {
      text = await extractTextFromPDF(fileData);
    } else if (fileType === 'docx') {
      text = await extractTextFromDOCX(fileData);
    } else {
      return res.status(400).json({ error: 'Unsupported file type. Only PDF and DOCX are supported.' });
    }

    if (!text || text.trim() === '') {
      console.error('Extracted text is empty or unreadable.');
      return res.status(400).json({
        error: 'Failed to extract text from the uploaded file. The file may be corrupted or unsupported.',
      });
    }

    console.log('Sending prompt to Gemini AI...');
    const questions = await generateQuiz(text);

    res.status(200).json({
      message: 'Quiz generated successfully!',
      questions,
    });
  } catch (error) {
    console.error('Error generating quiz:', error.message);
    res.status(500).json({ error: 'Failed to generate quiz.' });
  }
});

router.get('/list-notes', async (req, res) => {
  try {
    const gfsBucket = req.app.locals.gfsBucket;

    if (!gfsBucket) {
      console.error('GridFSBucket is not initialized');
      return res.status(500).json({ error: 'GridFSBucket is not initialized.' });
    }

    const files = await req.app.locals.db.collection('uploads.files').find().toArray();

    if (!files || files.length === 0) {
      return res.status(404).json({ error: 'No notes found.' });
    }

    res.status(200).json({
      message: 'Notes retrieved successfully.',
      notes: files.map((file) => ({
        fileId: file._id,
        filename: file.filename,
        uploadDate: file.uploadDate,
        contentType: file.contentType,
      })),
    });
  } catch (error) {
    console.error('Error retrieving notes:', error);
    res.status(500).json({ error: 'Failed to retrieve notes.' });
  }
});

router.get('/retrieve-note/:id', async (req, res) => {
  const { id } = req.params;

  try {
    const gfsBucket = req.app.locals.gfsBucket;

    if (!gfsBucket) {
      console.error('GridFSBucket is not initialized');
      return res.status(500).json({ error: 'GridFSBucket is not initialized.' });
    }

    const file = await req.app.locals.db.collection('uploads.files').findOne({ _id: new ObjectId(id) });

    if (!file) {
      return res.status(404).json({ error: 'File not found.' });
    }

    const readStream = gfsBucket.openDownloadStream(new ObjectId(id));

    res.setHeader('Content-Type', file.contentType);
    readStream.pipe(res);

    readStream.on('error', (err) => {
      console.error('Error streaming file:', err);
      res.status(500).json({ error: 'Failed to retrieve file content.' });
    });
  } catch (error) {
    console.error('Error retrieving note:', error);
    res.status(500).json({ error: 'Failed to retrieve note.' });
  }
});

export default router;