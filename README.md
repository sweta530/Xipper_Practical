# Xipper Hotel Booking Application

This repository contains a full-stack hotel booking application with features including hotel listings, room bookings, and web check-in functionality.

## Project Structure

```
└── 📁Xipper_Practical
    └── 📁backend        # Node.js/Express backend with Prisma ORM
    └── 📁frontend       # React frontend application
```

## Features

- User authentication (login/register)
- Browse available hotels
- Book hotel rooms
- View personal bookings
- Web check-in functionality

## Technologies Used

### Frontend

- React 19
- Material UI
- React Router
- Axios for API calls
- Moment.js for date handling

### Backend

- Node.js with Express
- Prisma ORM for database operations
- JWT for authentication
- Joi for validation
- bcryptjs for password hashing

## Getting Started

1. Clone the repository

```bash
git clone https://github.com/your-username/Xipper_Practical.git
cd Xipper_Practical
```

2. Set up the backend (see [backend README](./backend/README.md) for details)

```bash
cd backend
npm install
# Set up .env file based on .env.sample
npm start
```

3. Set up the frontend (see [frontend README](./frontend/README.md) for details)

```bash
cd frontend
npm install
# Set up .env file based on .env.sample
npm start
```

4. Access the application at `http://localhost:3000`

## Prerequisites

- Node.js (v16 or later recommended)
- npm (v8 or later recommended)
- Database (as configured in Prisma)
