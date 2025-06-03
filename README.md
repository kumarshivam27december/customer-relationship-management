# Mini CRM Platform

A modern CRM platform that enables customer segmentation, personalized campaign delivery, and intelligent insights.

## Features

### Authentication
- Google OAuth 2.0 based authentication
- Secure token-based session management
- Protected routes for authenticated users

### Campaign Management
- Dynamic rule builder for audience segmentation
- Support for complex conditions using AND/OR operators
- Real-time audience size preview
- Campaign history tracking
- Delivery statistics monitoring

### Data Management
- RESTful APIs for customer and order data ingestion
- Swagger UI documentation for API testing
- Secure data validation and processing

### Campaign Delivery
- Automated campaign delivery system
- Personalized message generation
- Delivery status tracking
- Communication log management

### AI Integration
- Natural Language to Segment Rules conversion
- AI-driven message suggestions
- Campaign performance summarization
- Smart scheduling recommendations

## Tech Stack

### Frontend
- React.js
- Material-UI for components
- Axios for API communication
- React Router for navigation
- Context API for state management

### Backend
- Node.js with Express
- MongoDB for database
- JWT for authentication
- Swagger for API documentation

### AI Tools
- OpenAI API for natural language processing
- AI-powered message generation
- Campaign analytics and insights

## Project Structure

```
mini-crm/
├── frontend/
│   ├── src/
│   │   ├── components/
│   │   ├── contexts/
│   │   ├── utils/
│   │   └── App.js
├── backend/
│   ├── controllers/
│   ├── models/
│   ├── routes/
│   ├── middleware/
│   └── server.js
└── README.md
```

## Setup Instructions

### Prerequisites
- Node.js (v14 or higher)
- MongoDB
- Google Cloud Platform account for OAuth
- OpenAI API key

### Frontend Setup
1. Navigate to frontend directory:
   ```bash
   cd frontend
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Create .env file:
   ```
   VITE_GOOGLE_CLIENT_ID=your_google_client_id
   VITE_API_URL=your_backend_url
   ```

4. Start development server:
   ```bash
   npm run dev
   ```

### Backend Setup
1. Navigate to backend directory:
   ```bash
   cd backend
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Create .env file:
   ```
   MONGODB_URI=your_mongodb_uri
   JWT_SECRET=your_jwt_secret
   GOOGLE_CLIENT_ID=your_google_client_id
   GOOGLE_CLIENT_SECRET=your_google_client_secret
   OPENAI_API_KEY=your_openai_api_key
   ```

4. Start server:
   ```bash
   npm start
   ```

## API Documentation

The API documentation is available through Swagger UI at:
```
http://localhost:5000/api-docs
```

## Architecture

The application follows a client-server architecture:

1. Frontend (React.js)
   - Handles user interface and interactions
   - Manages authentication state
   - Communicates with backend APIs
   - Implements campaign creation and management

2. Backend (Node.js/Express)
   - RESTful API endpoints
   - Authentication middleware
   - Database operations
   - AI integration services

3. Database (MongoDB)
   - Stores user data
   - Campaign information
   - Customer segments
   - Communication logs

## AI Features

1. Natural Language Processing
   - Converts user queries to segment rules
   - Example: "People who haven't shopped in 6 months" to logical conditions

2. Message Generation
   - AI-powered message suggestions
   - Context-aware content generation
   - Personalized recommendations

3. Analytics
   - Campaign performance insights
   - Delivery statistics analysis
   - Audience behavior patterns

## Known Limitations

1. Campaign Delivery
   - Simulated delivery system
   - No real email/SMS integration
   - Limited to test data

2. AI Integration
   - Dependent on OpenAI API availability
   - Limited to predefined use cases
   - No custom model training

3. Data Processing
   - No real-time data ingestion
   - Limited to sample data
   - No data export functionality

## Future Improvements

1. Real-time Updates
   - WebSocket integration
   - Live campaign statistics
   - Real-time audience updates

2. Enhanced AI Features
   - Custom model training
   - Advanced analytics
   - Predictive insights

3. Data Management
   - Bulk data import
   - Data export functionality
   - Advanced filtering options

## License

This project is licensed under the MIT License. 