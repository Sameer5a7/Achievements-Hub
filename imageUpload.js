const fs = require("fs");
const path = require("path");
const multer = require("multer");
const CustomError = require("../error/CustomError");

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    const rootDir = path.dirname(require.main.filename);
    let uploadPath;

    switch (file.fieldname) {
      case "photo":
        uploadPath = path.join(rootDir, "public", "userPhotos");
        break;
      case "image":
        uploadPath = path.join(rootDir, "public", "storyImages");
        break;
      case "pdfFile":
        uploadPath = path.join(rootDir, "public", "storyFiles");
        break;
      default:
        return cb(new CustomError("Invalid field for upload", 400), false);
    }

    // ✅ Ensure folder exists
    if (!fs.existsSync(uploadPath)) fs.mkdirSync(uploadPath, { recursive: true });

    cb(null, uploadPath);
  },

  filename: (req, file, cb) => {
    const timestamp = new Date().toISOString().replace(/:/g, "-");

    switch (file.fieldname) {
      case "photo":
        const ext = file.mimetype.split("/")[1];
        req.savedUserPhoto = `photo_user_${req.user.id}.${ext}`;
        cb(null, req.savedUserPhoto);
        break;

      case "image":
        req.savedStoryImage = `image_${timestamp}_${file.originalname}`;
        cb(null, req.savedStoryImage);
        break;

      case "pdfFile":
        req.savedStoryPdf = `pdf_${timestamp}_${file.originalname}`;
        cb(null, req.savedStoryPdf);
        break;
    }
  },
});

// ✅ File filter (images + PDFs)
const fileFilter = (req, file, cb) => {
  const allowedMimeTypes = [
    "image/jpeg",
    "image/jpg",
    "image/png",
    "image/gif",
    "application/pdf",
  ];

  if (!allowedMimeTypes.includes(file.mimetype)) {
    return cb(
      new CustomError("Please provide a valid file (JPG, PNG, GIF, or PDF)", 400),
      false
    );
  }

  cb(null, true);
};

// ✅ Export multer instance
const imageUpload = multer({ storage, fileFilter });

module.exports = imageUpload;
