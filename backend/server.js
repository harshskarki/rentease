const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const dotenv = require('dotenv');

dotenv.config();

const app = express();

app.use(cors({
  origin: process.env.CLIENT_URL || 'http://localhost:3000',
  credentials: true,
}));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use('/api/auth',            require('./routes/authRoutes'));
app.use('/api/items',           require('./routes/itemRoutes'));
app.use('/api/bookings',        require('./routes/bookingRoutes'));
app.use('/api/users',           require('./routes/userRoutes'));
app.use('/api/payments',        require('./routes/paymentRoutes'));
app.use('/api/wishlist',        require('./routes/wishlistRoutes'));
app.use('/api/search',          require('./routes/searchRoutes'));
app.use('/api/recommendations', require('./routes/recommendationRoutes'));

app.get('/', (req, res) => res.json({ message: 'RentEase API running' }));

app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(err.statusCode || 500).json({
    success: false,
    message: err.message || 'Server Error',
  });
});

const PORT = process.env.PORT || 5000;

async function startServer() {
  try {
    if (process.env.MONGO_URI && !process.env.MONGO_URI.includes('localhost')) {
      await mongoose.connect(process.env.MONGO_URI);
      console.log('MongoDB Atlas connected');
    } else {
      const { MongoMemoryServer } = require('mongodb-memory-server');
      const mongod = await MongoMemoryServer.create();
      const uri = mongod.getUri();
      await mongoose.connect(uri);
      console.log('Using in-memory MongoDB');
    }
    app.listen(PORT, () => console.log('Server running on port ' + PORT));
  } catch (err) {
    console.error('Failed to start:', err.message);
    process.exit(1);
  }
}

startServer();
