const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const jwt = require('express-jwt');
const jwksRsa = require('jwks-rsa');

require('dotenv').config();

// Initialize app
const app = express();
app.use(cors());
app.use(express.json());

const checkJwt = jwt({
    secret: jwksRsa.expressJwtSecret({
      cache: true,
      rateLimit: true,
      jwksRequestsPerMinute: 5,
      jwksUri: `https://<YOUR-AUTH0-DOMAIN>/.well-known/jwks.json`,
    }),
    audience: '<YOUR-API-AUDIENCE>',
    issuer: `https://<YOUR-AUTH0-DOMAIN>/`,
    algorithms: ['RS256'],
  });
  
  
// Apply the middleware globally for all routes under '/api'
app.use('/api', checkJwt);

// Example protected route
app.get('/api/protected', (req, res) => {
  res.send('You are authorized to access this protected route.');
});
// Start server
const PORT = process.env.PORT || 8000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
