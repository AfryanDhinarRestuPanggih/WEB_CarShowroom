# Car Showroom - Frontend (React)

Frontend aplikasi Car Showroom menggunakan React + Vite.

## Tech Stack

- **Framework**: React 18
- **Build Tool**: Vite
- **Routing**: React Router DOM v6
- **HTTP Client**: Axios
- **State Management**: React Context API
- **Styling**: CSS

## Quick Start

```bash
# Install dependencies
npm install

# Run development server
npm run dev

# Build for production
npm run build
```

Application runs at: `http://localhost:5173`

## Project Structure

```
Frontend/
├── src/
│   ├── components/        # Reusable components
│   │   ├── Navbar.jsx
│   │   └── ProtectedRoute.jsx
│   ├── pages/            # Page components
│   │   ├── Home.jsx
│   │   ├── Login.jsx
│   │   ├── Register.jsx
│   │   └── AdminLogin.jsx
│   ├── services/         # API services
│   │   ├── api.js
│   │   ├── authService.js
│   │   ├── carService.js
│   │   ├── testDriveService.js
│   │   ├── inquiryService.js
│   │   └── wishlistService.js
│   ├── context/          # React Context
│   │   └── AuthContext.jsx
│   └── App.jsx
└── package.json
```

## Features

- User Registration & Login
- Admin Login
- Car Listing with Filters
- JWT Authentication
- Protected Routes
- Responsive Design

## API Configuration

Backend API URL is configured in `src/services/api.js`:
```javascript
const API_BASE_URL = 'http://localhost:5122/api';
```

## Available Routes

- `/` - Home (Car Listing)
- `/login` - User Login
- `/register` - User Registration
- `/admin/login` - Admin Login

## Scripts

```bash
npm run dev          # Start development server
npm run build        # Build for production
npm run preview      # Preview production build
```
