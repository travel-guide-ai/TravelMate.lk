const app = require('./app');
const mongoose = require('mongoose');
require('dotenv').config();

mongoose.connect(process.env.MONGODB_URI)
  .then(() => {
    app.listen(process.env.PORT || 5000, () => {
      console.log('Server running...');
    });
  })
  .catch(err => console.error('MongoDB error:', err));
