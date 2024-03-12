import multer from 'multer';

const storage = multer.diskStorage({
  destination: (req, file, cb) => cb(null, 'public/'),
  filename: (req, file, cb) => {
    const ext = file.originalname
      .split('.')
      .filter(Boolean) // removes empty extensions (e.g. `filename...txt`)
      .slice(1)
      .join('.');
    cb(null, Date.now() + '.' + ext);
  },
});

const upload = multer({ storage });

// This is a function that receives a path in the "req.body" object,
// writes it to disk and saves the path in the "req.file" object
const saveFileMiddleware = upload.single;

export default saveFileMiddleware;
