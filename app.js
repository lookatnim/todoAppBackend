const express = require('express');
const connectDB = require('./config/db');
const bodyParser = require('body-parser');
const cors = require('cors');
const dotenv = require('dotenv');
const User = require('./models/User');
const bcrypt = require('bcryptjs');

// Load environment variables
dotenv.config();

// Initialize Express app
const app = express();

// Connect to the database
connectDB();

// Middleware
app.use(cors());
app.use(bodyParser.json());

// Routes
app.use('/api/auth', require('./routes/auth'));
app.use('/api/tasks', require('./routes/tasks'));

// Function to create a super admin user if none exists
const createSuperAdmin = async () => {
  try {
    const userCount = await User.countDocuments();
    if (userCount === 0) {
      const superAdmin = new User({
        username: 'admin',
        password: '12345', 
        role: 'admin',
      });

      // Hash the password before saving
      const salt = await bcrypt.genSalt(10);
      superAdmin.password = await bcrypt.hash(superAdmin.password, salt);

      await superAdmin.save();
      console.log('Super admin user created');
    }
  } catch (err) {
    console.error(err.message);
  }
};

// Start the server and create super admin user if necessary
const PORT = process.env.PORT || 5000;
app.listen(PORT, async () => {
  console.log(`Server running on port ${PORT}`);
  await createSuperAdmin();
});
