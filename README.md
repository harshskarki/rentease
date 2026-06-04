# 🚀 RentEase — Full Stack Rental Marketplace Platform

A modern full-stack rental marketplace where users can list items for rent, discover products nearby, and manage bookings seamlessly. Built with DSA algorithms integrated for performance optimization.

## 🌐 Live Demo

[![Frontend](https://img.shields.io/badge/Frontend-Live-blue?style=for-the-badge&logo=vercel)](https://rentease-mocha-three.vercel.app/)
[![Backend API](https://img.shields.io/badge/Backend-API-green?style=for-the-badge&logo=render)](https://rentease-backend-6clu.onrender.com/)

## ✨ Features

### 🔐 Authentication System
- Secure Register/Login system
- JWT-based authentication
- Password hashing using Bcrypt
- Protected routes & user sessions
- Change password & delete account

### 🏷️ Rental Listings
- Add rental items with image uploads (Cloudinary)
- Set pricing, category, city/location
- Manage your own listings
- Browse & search with autocomplete

### 🔍 Smart Search & Filtering
- Trie-based autocomplete search
- Filter by category
- Binary Search price range filter
- Priority Queue recommendation engine

### 📅 Booking System
- Select rental dates
- Automatic total price calculation
- Booking request workflow
- Booking history tracking

### 💳 Payments
- Razorpay payment integration
- Test mode support
- Payment status tracking

### 📧 Email Notifications
- Booking request email to owner
- Booking confirmation/rejection email to renter
- Powered by Resend

### 👤 User Profiles
- Edit profile with avatar upload
- Public profile page
- Stats — items listed, bookings made, rating
- Member since date

### 📊 Dashboard
- Renter Dashboard — view & track bookings
- Owner Dashboard — confirm/reject booking requests
- Manage listings

### ❤️ Wishlist
- Save items for later
- Remove from wishlist
- Dedicated wishlist page

### 🎨 UI/UX
- Dark mode toggle
- Pagination
- Responsive design
- Toast notifications

## 🧠 DSA Implementations

### 1. Trie — Autocomplete Search
- Built Trie data structure from scratch
- Each node stores references to matching items
- O(m) search time where m = length of search prefix
- Used for instant autocomplete suggestions in search box

### 2. Binary Search — Price Range Filter
- Implemented lowerBound and upperBound binary search variants
- Items sorted by price, binary search finds exact range
- O(log n) time complexity vs O(n) linear scan
- Used for efficient price range filtering on home page

### 3. Max Heap / Priority Queue — Recommendation Engine
- Built Max Heap from scratch with bubbleUp and bubbleDown
- Items scored by weighted formula: (reviews × 3) + (rating × 2) + bookings
- Extracts top-K popular items in O(K log n) time
- Used for "Popular Items" section on home page

## 🛠️ Tech Stack

### Frontend
- React.js
- React Router DOM
- Axios
- React Hot Toast
- React Icons

### Backend
- Node.js
- Express.js
- MongoDB Atlas
- Mongoose
- JWT Authentication
- Bcrypt.js
- Razorpay
- Resend (Email)
- Cloudinary (Image Upload)

### Deployment
- Vercel (Frontend)
- Render (Backend)
- MongoDB Atlas (Database)

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
│   │   ├── trie.js
│   │   ├── binarySearch.js
│   │   └── priorityQueue.js
│   └── server.js
│
├── frontend/
│   └── src/
│       ├── components/
│       ├── context/
│       ├── pages/
│       └── services/
│
└── README.md

## ⚙️ Installation & Setup

### Prerequisites
- Node.js
- npm
- MongoDB Atlas Account
- Git

### Backend Setup
```bash
git clone https://github.com/harshskarki/rentease.git
cd rentease/backend
npm install
cp .env.example .env
npm run dev
```

### Frontend Setup
```bash
cd ../frontend
npm install
npm start
```

### Environment Variables

PORT=5000

MONGO_URI=your_mongodb_connection

JWT_SECRET=your_secret_key

CLOUDINARY_CLOUD_NAME=your_cloud_name

CLOUDINARY_API_KEY=your_api_key

CLOUDINARY_API_SECRET=your_api_secret

RAZORPAY_KEY_ID=your_razorpay_key

RAZORPAY_KEY_SECRET=your_razorpay_secret

RESEND_API_KEY=your_resend_key

CLIENT_URL=http://localhost:3000

## 🔗 API Endpoints

### Auth Routes
- POST /api/auth/register
- POST /api/auth/login
- GET /api/auth/me

### Item Routes
- GET /api/items
- POST /api/items
- GET /api/items/:id
- PUT /api/items/:id
- DELETE /api/items/:id

### Booking Routes
- POST /api/bookings
- GET /api/bookings/my-bookings
- GET /api/bookings/owner-bookings
- PUT /api/bookings/:id/status

### DSA Routes
- GET /api/search/autocomplete?q= (Trie)
- GET /api/items?minPrice=&maxPrice= (Binary Search)
- GET /api/recommendations (Priority Queue)

## 📈 Performance Optimizations
- Trie for O(m) search
- Binary Search for O(log n) price filtering
- Priority Queue for O(K log n) recommendations
- Pagination for efficient data loading
- JWT session persistence
- Cloudinary CDN for images

## 👨‍💻 Developer
**Harshvardhan Singh Karki**
B.Tech CSE — 4th Year Student

Skills:
- Full Stack Development
- DSA & Algorithms
- AI Applications
- Modern UI/UX
- Scalable Web Apps

## ⭐ Support
If you liked this project:
- ⭐ Star the repository
- 🍴 Fork the project
- 🛠️ Contribute improvements

## 📜 License
This project is licensed under the MIT License.

## 🏁 Final Note
RentEase demonstrates full-stack development skills with real DSA implementations — Trie, Binary Search, and Max Heap — integrated into a production-ready application with payments, email notifications, image uploads, and deployment.
