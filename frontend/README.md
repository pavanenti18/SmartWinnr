# Smart Winnr
## Restaurant Rating & Review Platform

Smart Winnr is a full-stack web application that allows customers to discover restaurants, submit ratings and reviews, and manage their review history. Restaurant owners can manage their assigned restaurant, while administrators manage users, restaurants, and customer reviews.

## Features

### Customer
- Register and login securely.
- Browse restaurants.
- Search restaurants by name, location, or cuisine.
- View restaurant details and ratings.
- Submit restaurant reviews with ratings from 1 to 5.
- Edit and delete personal reviews.
- View average restaurant ratings and review counts.

### Restaurant Owner
- Secure owner login.
- View assigned restaurant details.
- Update restaurant name, location, cuisine, and description.
- View customer reviews.
- View average rating and total reviews.

### Administrator
- Secure administrator login.
- Dashboard with platform statistics.
- View registered users.
- Create, update, and delete restaurants.
- Assign restaurant owners.
- View customer reviews.
- Moderate and delete reviews.

## Technology Stack

### Frontend
- React.js
- Vite
- React Router DOM
- Axios
- CSS

### Backend
- Node.js
- Express.js
- REST API
- JWT Authentication
- bcrypt Password Hashing

### Database
- MongoDB
- Mongoose ODM

## Project Structure

```text
SmartWinnr/
│
├── backend/
│   ├── controllers/
│   ├── middleware/
│   ├── models/
│   ├── routes/
│   ├── server.js
│   ├── package.json
│   └── .env.example
│
├── frontend/
│   ├── src/
│   │   ├── App.jsx
│   │   ├── App.css
│   │   ├── api.js
│   │   └── main.jsx
│   ├── package.json
│   └── index.html
│
├── README.md
└── .gitignore
```

## Installation and Setup

### Prerequisites
- Node.js
- npm
- MongoDB Atlas account or local MongoDB
- Git

### 1. Clone the Repository

```bash
git clone YOUR_GITHUB_REPOSITORY_URL
cd SmartWinnr
```

### 2. Backend Setup

```bash
cd backend
npm install
```

Create a `.env` file inside the backend directory:

```env
PORT=5000
MONGO_URI=your_mongodb_connection_string
JWT_SECRET=your_secure_jwt_secret
```

Start the backend:

```bash
node server.js
```

Backend URL:

```text
http://localhost:5000
```

### 3. Frontend Setup

Open another terminal:

```bash
cd frontend
npm install
npm run dev
```

Frontend URL:

```text
http://localhost:5173
```

## API Endpoints

### Authentication

| Method | Endpoint | Description |
|---|---|---|
| POST | `/api/auth/register` | Register user |
| POST | `/api/auth/login` | Login user |

### Restaurants

| Method | Endpoint | Description |
|---|---|---|
| GET | `/api/restaurants` | List/search restaurants |
| GET | `/api/restaurants/:id` | Restaurant details |

### Reviews

| Method | Endpoint | Description |
|---|---|---|
| POST | `/api/reviews` | Create review |
| GET | `/api/reviews/restaurant/:restaurantId` | Get restaurant reviews |
| PUT | `/api/reviews/:id` | Update own review |
| DELETE | `/api/reviews/:id` | Delete own review |

### Administrator

| Method | Endpoint | Description |
|---|---|---|
| GET | `/api/admin/dashboard` | Dashboard statistics |
| GET | `/api/admin/users` | View users |
| POST | `/api/admin/restaurants` | Create restaurant |
| PUT | `/api/admin/restaurants/:id` | Update restaurant |
| DELETE | `/api/admin/restaurants/:id` | Delete restaurant |
| GET | `/api/admin/reviews` | View all reviews |
| DELETE | `/api/admin/reviews/:id` | Moderate review |

### Restaurant Owner

| Method | Endpoint | Description |
|---|---|---|
| GET | `/api/owner/restaurant` | View assigned restaurant and reviews |
| PUT | `/api/owner/restaurant` | Update assigned restaurant |

## Security Features

- Password hashing using bcrypt.
- JWT-based authentication.
- Role-based authorization.
- Protected administrator and owner routes.
- Customers can modify only their own reviews.
- Owners can update only their assigned restaurant.
- Input validation and error handling.
- Unique customer-restaurant review constraint.

## Database Models

### User
- Name
- Email
- Password
- Role
- CreatedAt
- UpdatedAt

### Restaurant
- Name
- Location
- Cuisine
- Description
- Owner Reference
- CreatedAt
- UpdatedAt

### Review
- Customer Reference
- Restaurant Reference
- Rating
- Comment
- CreatedAt
- UpdatedAt

## Testing

The following workflows have been tested manually:

- Customer registration and login.
- Restaurant browsing and search.
- Restaurant details.
- Review submission.
- Review editing and deletion.
- Administrator dashboard.
- Restaurant creation, update, and deletion.
- Review moderation.
- Owner dashboard.
- Owner restaurant updates.
- Owner review viewing.
- Role-based access control.

## Future Enhancements

- Restaurant image uploads.
- Advanced restaurant filters.
- Pagination.
- Restaurant analytics.
- Automated API testing.
- Deployment to cloud hosting.

## Author

Smart Winnr – Restaurant Rating & Review Platform

Developed as a full-stack web application project.
