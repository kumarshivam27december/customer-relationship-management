# Mini CRM Platform

A minimal CRM platform for customer segmentation and campaign management.

## Features
- Customer data ingestion API
- Campaign creation with audience segmentation
- Campaign delivery and tracking
- Campaign history view

## Tech Stack
- Frontend: React.js
- Backend: Node.js/Express
- Database: MongoDB

## Setup Instructions

### Prerequisites
- Node.js (v14 or higher)
- MongoDB
- npm or yarn

### Backend Setup
1. Navigate to the backend directory:
```bash
cd backend
```

2. Install dependencies:
```bash
npm install
```

3. Create a .env file with:
```
MONGODB_URI=mongodb://localhost:27017/crm
PORT=5000
```

4. Start the server:
```bash
npm start
```

### Frontend Setup
1. Navigate to the frontend directory:
```bash
cd frontend
```

2. Install dependencies:
```bash
npm install
```

3. Start the development server:
```bash
npm start
```

## API Documentation

### Customer API
- POST /api/customers - Add new customer
- GET /api/customers - Get all customers

### Campaign API
- POST /api/campaigns - Create new campaign
- GET /api/campaigns - Get all campaigns
- GET /api/campaigns/:id - Get campaign details

## Project Structure
```
├── backend/           # Node.js/Express backend
├── frontend/         # React frontend
└── README.md
``` 