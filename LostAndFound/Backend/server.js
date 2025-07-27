require('dotenv').config();
const scrapeEmails = require('./utils/emailScraper');
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const bodyParser = require('body-parser');
const cron = require('node-cron');
const authRoutes = require('./routes/auth');
const itemRoutes = require('./routes/items');
const errorHandler = require('./middleware/errorHandler');

const app = express();
const PORT = process.env.PORT || 5000;

app.use(cors());
app.use(bodyParser.json());

// Middleware
app.use(express.json()); // For parsing JSON bodies

// Routes
app.use('/auth', authRoutes);
app.use('/items', itemRoutes);

// Run the scraper every hour
cron.schedule('0 * * * *', () => {
    console.log('Running email scraper...');
    // scrapeEmails();
});

// Error Handling Middleware (should come last)
app.use(errorHandler);

app.listen(PORT, () => console.log(`Server running on port ${PORT}`));

// MongoDB Connection
mongoose.connect(process.env.MONGO_URI)
    .then(() => console.log(`Database connected`))
    .catch((error) => console.log(error));
