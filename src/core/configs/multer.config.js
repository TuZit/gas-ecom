import multer from "multer";

const uploadMemory = multer({
  // Lưu ở RAM
  storage: multer.memoryStorage(),
});

const uploadDisk = multer({
  // Lưu ở ổ cứng
  storage: multer.diskStorage({
    destination: function (req, file, cb) {
      cb(null, "./src/uploads/");
    },
    filename: function (req, file, cb) {
      cb(null, `${Date.now()}-${file.originalname}`);
    },
  }),
});

export { uploadMemory, uploadDisk };
