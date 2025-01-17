import express from 'express';
import mongoose from 'mongoose';
import dotenv from 'dotenv';
import cors from 'cors';
import authRoutes from './routes/authRoutes.js';
import uploadRoutes from './routes/uploadRoutes.js';
import chatbotRoutes from './routes/chatbotRoutes.js';
import quizRoutes from './routes/quizRoutes.js';
import translateRoutes from './routes/translate.js';
import profileRoutes from './routes/profileRoutes.js';
import searchRoutes from './routes/searchRoutes.js';
dotenv.config();

const app = express();
app.use(cors());
app.use(express.json());

// MongoDB connection setup
mongoose.connect(process.env.MONGO_URI, { useNewUrlParser: true, useUnifiedTopology: true })
  .then(() => console.log('MongoDB connected successfully'))
  .catch((err) => {
    console.error('MongoDB connection error:', err.message);
    process.exit(1);
  });

// GridFSBucket setup
let gfsBucket;
mongoose.connection.once('open', () => {
  gfsBucket = new mongoose.mongo.GridFSBucket(mongoose.connection.db, { bucketName: 'uploads' });
  app.locals.gfsBucket = gfsBucket;
  app.locals.db = mongoose.connection.db;
  console.log('GridFSBucket initialized.');
});

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/uploads', uploadRoutes);
app.use("/api/chatbot", chatbotRoutes);
app.use("/api/quiz", quizRoutes);
app.use('/api/editor', translateRoutes);
app.use('/api/profile', profileRoutes);
app.use("/api", searchRoutes);

// Global error handler
app.use((err, req, res, next) => {
  console.error('Unhandled error:', err);
  res.status(500).json({ error: 'Internal server error.' });
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
