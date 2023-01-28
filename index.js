import express from 'express';
import bodyParser from 'body-parser';
import cors from 'cors';
import mongoose from 'mongoose';
import dotenv from 'dotenv';
import helmet from 'helmet';
// import compression from 'compression';
import morgan from 'morgan';
import multer from 'multer';

dotenv.config();

const app = express();
const port = process.env.PORT || 3000;

// Connect to MongoDB
mongoose
  .connect(process.env.MONGO_URL, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(() =>
    // Start the server
    app.listen(port, () => {
      console.log(`Server is running on port ${port}`);
    })
  )
  .catch((err) => console.log(`${err} did not connected!`));

// Enable CORS
app.use(cors());

// Use helmet for security
app.use(helmet());

// Use compression for performance
// app.use(compression());

// Use morgan for logging
app.use(morgan('tiny'));

// Use body-parser to parse requests
app.use(bodyParser.json({ limit: '50mb' }));
app.use(bodyParser.urlencoded({ extended: true, limit: '50mb' }));

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, 'public/assets');
  },
  filename: (req, file, cb) => {
    cb(null, `${Date.now()}-${file.originalname}`);
  },
});
const upload = multer({ storage });
