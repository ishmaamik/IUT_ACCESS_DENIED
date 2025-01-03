// translate.js
import dotenv from 'dotenv';
import { GoogleGenerativeAI } from '@google/generative-ai';

dotenv.config();

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);
const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });

export const translateText = async (text, targetLanguage) => {
  if (!text || !targetLanguage) {
    throw new Error('Text and target language are required.');
  }

  const prompt = `Translate the following text into ${targetLanguage}:\n\n${text}`;
  try {
    const response = await model.generateContent(prompt);
    const translation = response?.response?.candidates[0]?.content?.parts[0]?.text.trim();

    if (!translation) {
      throw new Error('Translation failed.');
    }

    return translation;
  } catch (error) {
    console.error('Error during translation:', error);
    throw new Error('Failed to translate text.');
  }
};

// editor.js
import express from 'express';


const router = express.Router();

router.post('/translate', async (req, res) => {
  const { text, targetLanguage } = req.body;

  try {
    const translatedText = await translateText(text, targetLanguage);
    res.status(200).json({ translatedText });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

export default router;