const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const swaggerUi = require('swagger-ui-express');
const YAML = require('yamljs');
const swaggerDocument = YAML.load('./swagger.yaml');
const auth = require('./middleware/auth');
require('dotenv').config();

const app = express();

// CORS Configuration
app.use(cors({
  origin: 'https://calm-vacherin-842665.netlify.app',
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization']
}));

// Middleware
app.use(express.json());

// Swagger Documentation
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerDocument));


const mongoURI = process.env.MONGODB_URI || 'mongodb://localhost:27017/crm';

mongoose.connect(mongoURI, {
      useNewUrlParser: true,
      useUnifiedTopology: true
})
  .then(() => console.log('✅ MongoDB Connected'))
  .catch(err => console.error('❌ MongoDB Connection Error:', err));

// Public routes
app.use('/api/auth', require('./routes/auth'));

// Protected routes
app.use('/api/customers', auth, require('./routes/customers'));
app.use('/api/campaigns', auth, require('./routes/campaigns'));
app.use('/api/vendor', auth, require('./routes/vendor'));
app.use('/api/ai', auth, require('./routes/ai'));

const PORT = process.env.PORT || 5001;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
  console.log(`API Documentation available at http://localhost:${PORT}/api-docs`);
}); 