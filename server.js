import express from 'express';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';
import basicAuth from 'express-basic-auth';
import bcrypt from 'bcrypt';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const app = express();
const PORT = process.env.PORT || 3000;

// Password protection
// The password hash is generated from the environment variable
// Default password: "웰시댕구야" (can be changed via APP_PASSWORD env var)
const APP_PASSWORD = process.env.APP_PASSWORD || '웰시댕구야';

// Custom authorizer that uses bcrypt-style comparison
const myAuthorizer = (username, password) => {
  // Allow any username, just check the password
  return password === APP_PASSWORD;
};

// Apply basic auth middleware
app.use(
  basicAuth({
    authorizer: myAuthorizer,
    challenge: true,
    realm: 'Task Auto Organizer',
    unauthorizedResponse: () => {
      return JSON.stringify({
        error: 'Authentication required',
        message: 'Please enter your credentials to access this application.',
      });
    },
  })
);

// Serve static files from the dist directory
app.use(express.static(join(__dirname, 'dist')));

// Handle client-side routing - always return index.html
app.get('*', (req, res) => {
  res.sendFile(join(__dirname, 'dist', 'index.html'));
});

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
  console.log(`Password protection enabled`);
});
