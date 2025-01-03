import express from "express";
import PDFDocument from "pdfkit";
import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";
import dotenv from "dotenv";
import PDF from "../model/PDF.js";
import { generateCaption, generateTitle } from "./uploadRoutes.js";

// Initialize dotenv
dotenv.config();

const router = express.Router();

import { GoogleGenerativeAI } from "@google/generative-ai";

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);
const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });

export const translateText = async (text, targetLanguage) => {
  if (!text || !targetLanguage) {
    throw new Error("Text and target language are required.");
  }

  const prompt = `Translate the following text into ${targetLanguage}:\n\n${text} without giving any extra info or explanation`;
  try {
    const response = await model.generateContent(prompt);
    const translation = response?.response?.candidates[0]?.content?.parts[0]?.text.trim();

    if (!translation) {
      throw new Error("Translation failed.");
    }

    return translation;
  } catch (error) {
    console.error("Error during translation:", error);
    throw new Error("Failed to translate text.");
  }
};

router.post("/translate", async (req, res) => {
  const { text, targetLanguage } = req.body;

  try {
    const translatedText = await translateText(text, targetLanguage);
    res.status(200).json({ translatedText });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Define __filename and __dirname for ES modules
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Load the font file
const fontPath = path.resolve(__dirname, "../fonts/TiroBangla-Regular.ttf");
if (!fs.existsSync(fontPath)) {
  throw new Error("Font file does not exist at the specified path.");
}

// Route for converting text to PDF
// Route for converting text to PDF
router.post("/convert-to-pdf", async (req, res) => {
  const { text } = req.body;

  try {
    if (!text) {
      return res.status(400).json({ error: "Text is required." });
    }

    // Generate AI title and caption
    let aiGeneratedTitle = "";
    let aiGeneratedCaption = "";
    try {
      aiGeneratedTitle = await generateTitle(text);
      aiGeneratedCaption = await generateCaption(text);
    } catch (err) {
      console.error("Error generating title or caption:", err.message);
      return res.status(500).json({ error: "Failed to generate title or caption." });
    }

    // Path to save the PDF temporarily
    const tempPath = path.resolve(__dirname, "../temp", `translated_${Date.now()}.pdf`);

    // Create a PDF document using PDFKit
    const doc = new PDFDocument();
    const writeStream = fs.createWriteStream(tempPath);
    doc.pipe(writeStream);

    // Register and use the Bangla font
    doc.registerFont("TiroBangla-Regular", fontPath);
    doc.font("TiroBangla-Regular").fontSize(14);

    // Add text to the PDF
    doc.text(text, { align: "left" }); // Add Bangla text
    doc.text(`\nTitle: ${aiGeneratedTitle}`, { align: "center" }); // Add AI-generated title
    doc.text(`\nCaption: ${aiGeneratedCaption}`, { align: "center" }); // Add AI-generated caption

    // Finalize the PDF
    doc.end();

    writeStream.on("finish", async () => {
      // Save metadata to the database
      try {
        const pdfData = new PDF({
          username: req.user?.username || "placeholder_username",
          pdfFileName: path.basename(tempPath),
          aiGeneratedTitle,
          aiGeneratedCaption,
        });
        await pdfData.save();
      } catch (err) {
        console.error("Error saving metadata to the database:", err.message);
        return res.status(500).json({ error: "Failed to save metadata." });
      }

      // Send the file as a response for download
      res.download(tempPath, "translated.pdf", (err) => {
        if (err) {
          console.error("Error sending PDF:", err);
        }
        fs.unlinkSync(tempPath); // Delete temp file after sending
      });
    });

    writeStream.on("error", (err) => {
      console.error("Error writing PDF file:", err.message);
      res.status(500).json({ error: "Failed to generate PDF." });
    });
  } catch (error) {
    console.error("Error converting text to PDF:", error.message);
    res.status(500).json({ error: "Failed to generate PDF." });
  }
});


export default router;
