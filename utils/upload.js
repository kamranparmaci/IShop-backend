const uploadImage = () => {
  const storage = multer.diskStorage({
    destination: (req, file, cb) => {
      cb(null, 'public/assets');
    },
    filename: (req, file, cb) => {
      cb(null, `${Date.now()}-${file.originalname}`);
    },
  });
  const upload = multer({ storage });
  return upload;
};

export default uploadImage;
