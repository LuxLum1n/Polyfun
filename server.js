const express = require('express');
const fs = require('fs');
const path = require('path');

const app = express();
app.use(express.urlencoded({ extended: true }));
app.use(express.static('public')); // Serves static files

const TRACKS_DIR = path.join(__dirname, 'public/tracks');
const HOMEPAGE = path.join(__dirname, 'public/poly.html');

// Ensure the tracks directory exists
if (!fs.existsSync(TRACKS_DIR)) {
  fs.mkdirSync(TRACKS_DIR, { recursive: true });
}

// Function to update the homepage dynamically
const updateHomepage = (title, trackFile) => {
  let homepageContent = fs.readFileSync(HOMEPAGE, 'utf8');

  const newTrackEntry = `<div class="card">
        <img src="https://via.placeholder.com/300x150" alt="Track Image">
        <div class="card-content">
          <h2>"${title}"</h2>
          <p>Experience the thrill of Track 2, designed for high speed and stunning aesthetics.</p>
          <button class="btn"><a href="tracks/${trackFile}">play</a></button>
        </div>
      </div>`;

  if (!homepageContent.includes(newTrackEntry)) {
    homepageContent = homepageContent.replace(
      '<!-- TRACKS_PLACEHOLDER -->',
      `${newTrackEntry}\n<!-- TRACKS_PLACEHOLDER -->`
    );

    fs.writeFileSync(HOMEPAGE, homepageContent);
  }
};

// Handle form submission
app.post('/create-track', (req, res) => {
  const { trackTitle, trackDescription } = req.body;

  if (!trackTitle || !trackDescription) {
    return res.status(400).send('Title and description are required!');
  }

  const filename = trackTitle.toLowerCase().replace(/\s+/g, '-') + '.html';
  const filePath = path.join(TRACKS_DIR, filename);

  const trackPageContent = `
  <!DOCTYPE html>
  <html lang="en">
  <head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1">
    <title>${trackTitle}</title>
    <link rel="stylesheet" href="../styles.css">
  </head>
  <body>
    <h1>${trackTitle}</h1>
    <p>${trackDescription}</p>
    <a href="../poly.html">Back to Homepage</a>
  </body>
  </html>`;

  fs.writeFileSync(filePath, trackPageContent);

  updateHomepage(trackTitle, filename);

  res.redirect('/poly.html'); // Redirect back to homepage
});

app.listen(3000, () => console.log('Server running on http://localhost:3000'));
