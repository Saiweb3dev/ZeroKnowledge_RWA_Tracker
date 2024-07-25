// src/app.js
const express = require('express');
const app = express();
const cors = require('cors');
const nftRoutes = require("./routes/nft")
// Middleware
app.use(express.json());
const corsOptions = {
  origin: 'http://localhost:3000', // Allow only your Next.js application
  optionsSuccessStatus: 200 // For legacy browser support
};

app.use(cors(corsOptions));
// Routes
app.use('/api/nft',nftRoutes)
app.use('/api', require('./routes/api'));

// Error handling middleware
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).send('Something broke!');
});

// Start the server
const PORT = process.env.PORT || 8080;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});