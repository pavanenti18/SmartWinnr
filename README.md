# SmartWinnr – Restaurant Rating & Review Platform

## Project Overview
SmartWinnr is a full-stack web application that allows customers to browse restaurants, submit ratings and reviews, and enables restaurant owners and administrators to manage restaurant information and reviews.

## Tech Stack
- Frontend: React, Vite, Axios
- Backend: Node.js, Express.js
- Database: MongoDB Atlas, Mongoose
- Authentication: JWT
- Password Security: bcrypt

## User Roles
- Customer
- Restaurant Owner
- Admin

## Features

### Customer
- Register and login
- Browse and search restaurants
- View restaurant details and ratings
- Submit, edit, and delete reviews
- One review per customer per restaurant

### Restaurant Owner
- View assigned restaurant
- View customer reviews
- Update restaurant details

### Admin
- Dashboard statistics
- View users
- Manage restaurants
- Moderate reviews

## Project Structure
- `frontend/` – React application
- `backend/` – Express API and MongoDB models

## Installation and Setup

### Backend
```bash
cd backend
npm install
```

Configure `.env`:
```env
PORT=5000
MONGO_URI=your_mongodb_connection_string
JWT_SECRET=your_secret
```

Start backend:
```bash
node server.js
```

### Frontend
```bash
cd frontend
npm install
npm run dev
```

## API Routes
- `/api/auth`
- `/api/restaurants`
- `/api/reviews`
- `/api/admin`
- `/api/owner`

## Security
- Password hashing using bcrypt
- JWT authentication
- Role-based authorization
- Input validation
- Review ownership verification

## Author
Full Stack Development Project – SmartWinnr
