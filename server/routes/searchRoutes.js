// server/routes/searchRoutes.js
import express from "express";
import PDF from "../model/PDF.js";
import User from "../model/User.js";

const router = express.Router();
router.get("/search", async (req, res) => {
  try {
    const { term } = req.query;
    console.log("Search endpoint hit with term:", term); // Debug log
    const searchRegex = new RegExp(term, "i");

    const pdfs = await PDF.find({
      $or: [
        { pdfFileName: searchRegex },
        { aiGeneratedTitle: searchRegex },
      ],
    }).select("pdfFileName aiGeneratedTitle userId uploadedAt");

    const users= await User.find({
        $or: [
            { username: searchRegex },
        ],
    }).select("username role");
    console.log("Search results:", pdfs, users); // Debug log
    res.json({ pdfs, users});
  } catch (error) {
    console.error("Search error:", error); // Debug log
    res.status(500).json({ error: "Search failed" });
  }
});

export default router;