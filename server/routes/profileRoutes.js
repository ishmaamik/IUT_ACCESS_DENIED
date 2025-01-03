import express from "express";
import { verifyToken } from "../middlewares/auth.js";
import User from "../model/User.js";
const router = express.Router();
import PDF from "../model/PDF.js";
router.get("/profile", verifyToken, async (req, res) => {
    try {
      if (!req.user || !req.user.userId) {
        console.error("User ID missing in request.");
        return res.status(400).json({ error: "User not authenticated." });
      }
  
      const user = await User.findById(req.user.userId).select("-password");
      if (!user) {
        console.error("User not found.");
        return res.status(404).json({ error: "User not found." });
      }
  
      const uploadedPdfs = await PDF.find({ userId: user.userId });
      const downloadedPdfs = []; // Add logic for downloaded PDFs if tracking is implemented
  
      res.status(200).json({ user, uploadedPdfs, downloadedPdfs });
    } catch (error) {
      console.error("Error in /profile route:", error.message);
      res.status(500).json({ error: "Failed to fetch profile data." });
    }
  });
  router.put("/username", verifyToken, async (req, res) => {
    try {
      const user = await User.findByIdAndUpdate(
        req.user.userId,
        { username: req.body.username },
        { new: true }
      );
      res.status(200).json({ username: user.username });
    } catch (error) {
      res.status(500).json({ error: "Failed to update username." });
    }
  });
  
  router.put("/social-links", verifyToken, async (req, res) => {
    try {
      const user = await User.findByIdAndUpdate(
        req.user.userId,
        { socialLinks: req.body.socialLinks },
        { new: true }
      );
      res.status(200).json({ socialLinks: user.socialLinks });
    } catch (error) {
      res.status(500).json({ error: "Failed to update social links." });
    }
  });
  
  
  router.get("/pdfs", verifyToken, async (req, res) => {
    try {
      const username = req.user.username; // Logged-in user's username
  
      // Fetch PDFs with selected fields
      const userPdfs = await PDF.find({ username })
        .select("pdfFileName aiGeneratedTitle aiGeneratedCaption uploadedAt")
        .lean();
  
      if (!userPdfs || userPdfs.length === 0) {
        return res.status(404).json({ error: "No PDFs found for this user." });
      }
  
      // Format the response
      const formattedPdfs = userPdfs.map((pdf) => ({
        id: pdf._id,
        title: pdf.aiGeneratedTitle,
        fileName: pdf.pdfFileName,
        caption: pdf.aiGeneratedCaption,
        uploadedAt: pdf.uploadedAt,
      }));
  
      res.status(200).json({ pdfs: formattedPdfs });
    } catch (error) {
      console.error("Error fetching PDFs:", error.message);
      res.status(500).json({ error: "Failed to fetch PDFs." });
    }
  });
  
export default router;