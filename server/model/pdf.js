// pdf.js
import mongoose from 'mongoose';

const pdfSchema = new mongoose.Schema({
  username: { type: String, required: true },
  pdfFileName: { type: String, required: true },
  aiGeneratedTitle: { type: String, required: true },
  aiGeneratedCaption: { type: String, required: true },
  uploadedAt: { type: Date, default: Date.now },
});

export default mongoose.model('PDF', pdfSchema);