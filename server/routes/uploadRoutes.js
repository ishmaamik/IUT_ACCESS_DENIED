import express from "express";
import multer from "multer";
import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";
import { verifyToken, authorizeRole } from "../middlewares/auth.js";

const router = express.Router();
const upload = multer({ dest: "temp/" }); // Temporary storage for uploaded files
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Route to upload notes (Editors only)
// Route to upload notes (Editors and Admins)
router.post(
  "/upload",
  verifyToken, // Authenticate the user
  upload.single("file"),
  async (req, res) => {
    if (!req.file) {
      return res.status(400).json({ error: "No file uploaded." });
    }

    try {
      const gfsBucket = req.app.locals.gfsBucket;

      if (!gfsBucket) {
        return res.status(500).json({ error: "GridFSBucket is not initialized." });
      }

      const tempFilePath = path.join(__dirname, "../", req.file.path);
      const readStream = fs.createReadStream(tempFilePath);

      // Determine the metadata based on the role
      const userRole = req.user.role;
      const metadata = {
        status: userRole === "Admin" ? "approved" : "pending", // Automatically approve if the role is Admin
        uploader: req.user.userId,
      };

      const uploadStream = gfsBucket.openUploadStream(req.file.originalname, { metadata });

      readStream.pipe(uploadStream);

      uploadStream.on("finish", () => {
        fs.unlinkSync(tempFilePath); // Delete temporary file
        const message =
          userRole === "Admin"
            ? "File is uploaded successfully!"
            : "File is to be uploaded and is pending for Admin's approval!!";
        res.status(200).json({
          message,
          fileId: uploadStream.id,
          filename: req.file.originalname,
        });
      });

      uploadStream.on("error", (err) => {
        console.error("Error uploading file to GridFS:", err);
        res.status(500).json({ error: "Failed to upload file." });
      });
    } catch (error) {
      res.status(500).json({ error: "An error occurred during file upload." });
    }
  }
);


export default router;
