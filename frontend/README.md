# Hotel Booking Frontend

This is the frontend portion of the Xipper Hotel Booking application built with React.

## Features

- User authentication (login/register)
- Browse available hotels
- Book hotel rooms
- View personal bookings
- Web check-in functionality

## Tech Stack

- React 19
- Material UI 6
- React Router 7
- Axios for API calls
- Moment.js for date handling

## Prerequisites

- Node.js (v16 or later recommended)
- npm (v8 or later recommended)

## Installation

1. Navigate to the frontend directory

```bash
cd frontend
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
REACT_APP_API_URL=http://localhost:4000
```

## Running the Application

```bash
npm start
```

The application will be available at `http://localhost:3000`

## Folder Structure

```
└── 📁frontend
    └── 📁public                 # Static assets
    └── 📁src
        └── App.js               # Main application component
        └── 📁components         # Reusable components
            └── Navbar.js
            └── ProtectedRoutes.js
        └── 📁pages              # Page components
            └── Booking.js
            └── CheckIn.js
            └── Hotels.js
            └── Login.js
            └── MyBookings.js
            └── Register.js
        └── 📁services           # API services
            └── api.js
```

## Pages

- **Login.js**: User authentication page
- **Register.js**: New user registration page
- **Hotels.js**: Browse available hotels
- **Booking.js**: Book a hotel room
- **MyBookings.js**: View personal bookings
- **CheckIn.js**: Web check-in functionality

## Building for Production

```bash
npm run build
```

This will create a `build` directory with optimized production build.

## Testing

```bash
npm test
```

## Additional Information

- The application uses React Router for navigation
- Protected routes require authentication
- API calls are centralized in the `services/api.js` file
