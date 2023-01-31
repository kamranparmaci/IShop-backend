import multer from "multer";

const uploadImage = (type, name) => {
  const storage = multer.diskStorage({
    destination: (req, file, cb) => {
      cb(null, "public/assets");
    },
    filename: (req, file, cb) => {
      cb(null, `${Date.now()}-${file.originalname}`);
    },
  });
  const upload = multer({ storage });
  if (type === "single") {
    return upload.single(name);
  } else {
    return upload.multiple(name);
  }
};

export default uploadImage;
