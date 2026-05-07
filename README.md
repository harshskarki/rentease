# 🚀 RentEase — Full Stack Rental Marketplace Platform

A modern full-stack rental marketplace where users can list items for rent, discover products nearby, and manage bookings seamlessly.

# 🌐 Live Demo

## 🔗 Project Links

[![Frontend](https://img.shields.io/badge/Frontend-Live-blue?style=for-the-badge&logo=vercel)](https://rentease-mocha-three.vercel.app/)

[![Backend API](https://img.shields.io/badge/Backend-API-green?style=for-the-badge&logo=render)](https://rentease-backend-6clu.onrender.com/)


## 📸 Preview

✔ User Authentication

✔ Create Rental Listings

✔ Browse & Search Products

✔ Booking Management

✔ Owner Dashboard

✔ Booking Approval System

✔ JWT Protected Routes

✔ Responsive UI

## ✨ Features

🔐 Authentication System

Secure Register/Login system

JWT-based authentication

Password hashing using Bcrypt

Protected routes & user sessions

## 🏷️ Rental Listings

### Users can:

Add rental items

Upload item details

Set pricing

Choose category

Add city/location

Manage their own listings

## 🔍 Smart Search & Filtering

Search by city

Filter by category

Browse available rental items

Responsive product grid

## 📅 Booking System

Select rental dates

Automatic total price calculation

Booking request workflow

Booking history tracking

## 📊 User Dashboard

Renter Dashboard

View bookings

Track booking status

Manage rented items

Owner Dashboard

Accept booking requests

Reject booking requests

Manage listings

## 🛠️ Tech Stack

Frontend

React.js

React Router DOM

Axios

React Hot Toast

React Icons

CSS3

Backend

Node.js

Express.js

MongoDB Atlas

Mongoose

JWT Authentication

Bcrypt.js

Deployment

Vercel (Frontend)

Render (Backend)

MongoDB Atlas (Database)

## 📂 Project Structure

rentease/
│
├── backend/
│   ├── config/
│   ├── controllers/
│   ├── middleware/
│   ├── models/
│   ├── routes/
│   ├── utils/
│   └── server.js
│
├── frontend/
│   └── src/
│       ├── assets/
│       ├── components/
│       ├── context/
│       ├── hooks/
│       ├── pages/
│       ├── services/
│       └── utils/
│
├── README.md
└── package.json

## ⚙️ Installation & Setup

### 📌 Prerequisites

Make sure you have installed:

Node.js
 
npm

MongoDB Atlas Account

Git

### 🔧 Backend Setup

#### Clone the repository

git clone https://github.com/your-username/rentease.git

#### Navigate to backend

cd rentease/backend

#### Install dependencies

npm install

#### Create environment file

cp .env.example .env

#### Start backend server

npm run dev

### 🎨 Frontend Setup

#### Navigate to frontend

cd ../frontend

#### Install dependencies

npm install

#### Start frontend

npm start

### 🔑 Environment Variables

Create a .env file inside backend folder.

PORT=5000

MONGO_URI=your_mongodb_connection

JWT_SECRET=your_secret_key

### 🔗 API Endpoints

#### Auth Routes

POST /api/auth/register

POST /api/auth/login

#### Listing Routes

GET    /api/items

POST   /api/items

GET    /api/items/:id

DELETE /api/items/:id

#### Booking Routes

POST /api/bookings

GET  /api/bookings/user

PUT  /api/bookings/:id/status

## 🧠 Key Concepts Used

REST API Architecture

JWT Authentication

Protected Routes

CRUD Operations

MongoDB Relationships

State Management

Responsive Design

Full Stack Deployment

## 🚀 Future Improvements

📸 Image Upload with Cloudinary

💳 Online Payments Integration

⭐ Ratings & Reviews

💬 Real-time Chat System

🔔 Email Notifications

📱 Progressive Web App (PWA)

🗺️ Google Maps Integration

❤️ Wishlist & Favorites

## 🧪 Testing Ideas

Authentication validation

API route testing

Booking overlap prevention

Error handling

Mobile responsiveness testing

## 📈 Performance Optimizations

Lazy loading components

Optimized API calls

JWT session persistence

Efficient MongoDB queries

Reusable React components

## 🤝 Contributing

Contributions are welcome!

### Fork repository
### Create new branch
git checkout -b feature-name

### Commit changes
git commit -m "Added new feature"

### Push branch
git push origin feature-name
👨‍💻 Developer
Harshvardhan Singh Karki

B.Tech CSE Student

Experince:

Full Stack Development

AI Applications

Modern UI/UX

Scalable Web Apps

## ⭐ Support

If you liked this project:

⭐ Star the repository

🍴 Fork the project

🛠️ Contribute improvements

## 📜 License

This project is licensed under the MIT License.

## 🏁 Final Note

RentEase is built to simplify peer-to-peer rentals with a clean interface, secure authentication, and a scalable backend architecture. The project demonstrates full-stack development skills including API design, database management, authentication, deployment, and responsive frontend engineering.
