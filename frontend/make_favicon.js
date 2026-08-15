import fs from 'fs';

const jpegPath = 'public/JobYtra.jpeg';
if (fs.existsSync(jpegPath)) {
  const jpeg = fs.readFileSync(jpegPath);
  const b64 = jpeg.toString('base64');
  const dataUri = `data:image/jpeg;base64,${b64}`;

  const svg = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100">
  <defs>
    <clipPath id="circleView">
      <circle cx="50" cy="50" r="50" />
    </clipPath>
  </defs>
  <image href="${dataUri}" width="100" height="100" clip-path="url(#circleView)" preserveAspectRatio="xMidYMid slice" />
</svg>`;

  fs.writeFileSync('public/favicon.svg', svg);
  console.log('Successfully created public/favicon.svg');
} else {
  console.log('public/logo.jpeg not found');
}
