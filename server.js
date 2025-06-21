const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const taskRoutes = require('./routes/taskRoutes');

const app = express();

// Middleware
app.use(cors());
app.use(express.json());
app.use('/tasks', taskRoutes);

// Connect to MongoDB only if not in test
if (process.env.NODE_ENV !== 'test') {
  mongoose.connect('mongodb://localhost:27017/tasktrackr', {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(() => {
    const PORT = process.env.PORT || 5000;
    app.listen(PORT, () => {
      console.log(`🚀 Server running on port ${PORT}`);
    });
  })
  .catch((err) => console.error('MongoDB connection error:', err));
}

module.exports = app; // ✅ Export app for tests
