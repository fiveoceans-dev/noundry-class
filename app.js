const express = require('express');
const multer = require('multer');
const path = require('path');

const app = express();
const port = process.env.PORT || 3000;


// Set storage for uploaded images using Multer
const storage = multer.diskStorage({
  destination: './public/uploads/',
  filename: function (req, file, cb) {
    cb(null, file.fieldname + '-' + Date.now() + path.extname(file.originalname));
  }
});

const upload = multer({ storage });

// Array to store image data (including Twitter handle and trait name)
const images = [];

// Store the last input values
let lastInput = {};

// Serve static files from the 'public' folder
app.use(express.static('public'));

// Set EJS as the view engine
app.set('view engine', 'ejs');

// Render the index page with the image gallery and last input values
app.get('/', (req, res) => {
  res.render('index', { images, lastInput });
});

// Handle image upload
app.post('/', upload.single('image'), (req, res, next) => {
  if (req.file) {
    const { twitterHandle, traitName } = req.body;
    const imageUrl = `/uploads/${req.file.filename}`;
    images.push({ url: imageUrl, twitterHandle, traitName });

    // Save the last input values
    lastInput = { twitterHandle, traitName };
  }
  res.redirect('/');
});

// Start the server
app.listen(port, () => {
  console.log(`Server is running at http://localhost:${port}`);
});
