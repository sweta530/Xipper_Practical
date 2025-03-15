# Hotel Booking Backend API

This is the backend API for the Xipper Hotel Booking application built with Node.js, Express, and Prisma ORM.

## Features

- User authentication and authorization
- Hotel and room management
- Booking management
- Check-in functionality
- RESTful API endpoints

## Tech Stack

- Node.js with Express
- Prisma ORM for database operations
- JWT for authentication
- Joi for input validation
- bcryptjs for password hashing

## Prerequisites

- Node.js (v16 or later recommended)
- npm (v8 or later recommended)
- Database (PostgreSQL, MySQL, or SQLite)

## Installation

1. Navigate to the backend directory

```bash
cd backend
```

2. Install dependencies

```bash
npm install
```

3. Create a `.env` file based on `.env.sample`

```bash
cp .env.sample .env
```

4. Update the `.env` file with your configuration

```
PORT=4000
DATABASE_URL="postgresql://username:password@localhost:5432/xipper_db?schema=public"
JWT_SECRET="your_jwt_secret_key"
```

5. Set up the database with Prisma

```bash
npx prisma migrate dev --name init
```

## Running the Application

```bash
npm start
```

The API will be available at `http://localhost:4000`

## API Endpoints

### Authentication

- `POST /api/auth/register` - Register a new user
- `POST /api/auth/login` - Login and get JWT token

### Hotels

- `GET /api/hotels` - Get all hotels
- `GET /api/hotels/:id` - Get hotel by ID
- `POST /api/hotels` - Create a new hotel (admin only)
- `PUT /api/hotels/:id` - Update hotel (admin only)
- `DELETE /api/hotels/:id` - Delete hotel (admin only)

### Rooms

- `GET /api/rooms` - Get all rooms
- `GET /api/rooms/:id` - Get room by ID
- `POST /api/rooms` - Create a new room (admin only)
- `PUT /api/rooms/:id` - Update room (admin only)
- `DELETE /api/rooms/:id` - Delete room (admin only)

### Bookings

- `GET /api/bookings` - Get all bookings for current user
- `GET /api/bookings/:id` - Get booking by ID
- `POST /api/bookings` - Create a new booking
- `PUT /api/bookings/:id` - Update booking
- `DELETE /api/bookings/:id` - Cancel booking

### Check-in

- `POST /api/checkin` - Web check-in for a booking
- `GET /api/checkin/:bookingId` - Get check-in details

## Folder Structure

```
└── 📁backend
    └── 📁prisma
        └── schema.prisma      # Database schema
    └── 📁src
        └── index.js           # App entry point
        └── 📁controllers      # API controllers
        └── 📁middleware       # Express middleware
        └── 📁models           # Database models
        └── 📁routes           # API routes
        └── 📁services         # Business logic
        └── 📁utils            # Utility functions
        └── 📁validations      # Input validation schemas
```

## Database Schema

The database schema is defined in `prisma/schema.prisma`. It includes models for users, hotels, rooms, bookings, and check-ins.

## Authentication

The API uses JWT for authentication. Protected routes require a valid JWT token in the Authorization header:

```
Authorization: Bearer <token>
```

## Error Handling

The API returns standard HTTP status codes and error messages in the following format:

```json
{
  "error": true,
  "message": "Error message"
}
```

## Validation

Input validation is handled using Joi. Each API endpoint has its own validation schema.
