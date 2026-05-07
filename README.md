# RentEase ??

A full-stack rental marketplace platform where users can list items for rent and book items from others.

## ?? Live Demo
- **Frontend:** https://rentease-mocha-three.vercel.app
- **Backend API:** https://rentease-backend-6clu.onrender.com

## ? Features
- User authentication (Register/Login with JWT)
- List items for rent with category, price, and location
- Browse and search items by city and category
- Book items with date selection and price calculation
- Dashboard for managing listings and bookings
- Owner can confirm or reject booking requests

## ??? Tech Stack
**Frontend**
- React.js
- React Router DOM
- Axios
- React Hot Toast
- React Icons

**Backend**
- Node.js
- Express.js
- MongoDB (Atlas)
- Mongoose
- JWT Authentication
- Bcrypt.js

**Deployment**
- Frontend: Vercel
- Backend: Render
- Database: MongoDB Atlas

## ?? Run Locally

### Prerequisites
- Node.js installed
- MongoDB Atlas account

### Backend Setup
```bash
cd backend
npm install
cp .env.example .env
# Fill in your .env values
npm run dev
```

### Frontend Setup
```bash
cd frontend
npm install
npm start
```

## ?? Project Structure
rentease/
+-- backend/
¦   +-- config/
¦   +-- controllers/
¦   +-- middleware/
¦   +-- models/
¦   +-- routes/
¦   +-- server.js
+-- frontend/
+-- src/
+-- components/
+-- context/
+-- pages/
+-- services/

## ????? Developer
Built by Harshvardhan SK — B.Tech CSE Student
