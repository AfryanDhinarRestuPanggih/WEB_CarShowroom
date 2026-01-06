# Car Showroom - Full Stack Application

Aplikasi Car Showroom lengkap dengan Backend ASP.NET Core dan Frontend React.

## Project Overview

Website showroom mobil yang memungkinkan user untuk:
- Browse dan filter mobil
- Booking test drive
- Mengirim inquiry
- Menyimpan wishlist

Admin dapat:
- Manage mobil (CRUD)
- Approve/reject test drive
- Respond to inquiries
- View dashboard

## Tech Stack

### Backend
- ASP.NET Core 9.0 Web API
- Entity Framework Core 9.0
- SQL Server
- JWT Authentication
- BCrypt Password Hashing
- Swagger/OpenAPI

### Frontend
- React 18
- Vite
- React Router DOM v6
- Axios
- Context API
- CSS

## Project Structure

```
WebShowroom/
├── Backend/              # ASP.NET Core Web API
│   ├── Controllers/
│   ├── Models/
│   ├── Data/
│   ├── DTOs/
│   ├── Services/
│   └── Migrations/
├── Frontend/             # React Application
│   └── src/
│       ├── components/
│       ├── pages/
│       ├── services/
│       └── context/
└── README.md
```

## Quick Start

### Backend Setup

1. **Update Connection String**
   Edit `Backend/appsettings.json`:
   ```json
   "ConnectionStrings": {
     "DefaultConnection": "Server=localhost;Database=CarShowroomDB;Trusted_Connection=True;TrustServerCertificate=True"
   }
   ```

2. **Create Database**
   ```bash
   cd Backend
   dotnet ef database update
   ```

3. **Run Backend**
   ```bash
   dotnet run
   ```
   Backend runs at: `http://localhost:5122`
   Swagger UI: `http://localhost:5122/swagger`

### Frontend Setup

1. **Install Dependencies**
   ```bash
   cd Frontend
   npm install
   ```

2. **Run Frontend**
   ```bash
   npm run dev
   ```
   Frontend runs at: `http://localhost:5173`

## Features

### Implemented
- User Registration & Login
- Admin Login
- JWT Authentication
- Car Listing with Filters & Sorting
- Protected Routes
- Responsive Design
- API Service Layer
- Error Handling

### Database Tables
- Users
- Admins
- Cars
- CarImages
- TestDrives
- Inquiries
- Wishlists

### API Endpoints (26 total)
- Authentication (3 endpoints)
- Cars (5 endpoints)
- Test Drives (5 endpoints)
- Inquiries (5 endpoints)
- Wishlist (4 endpoints)

## Default Ports

- Backend API: `http://localhost:5122`
- Frontend: `http://localhost:5173`
- Swagger UI: `http://localhost:5122/swagger`

## Documentation

- **Backend**: See `Backend/README.md`
- **Frontend**: See `Frontend/README.md`
- **Database Setup**: See `Backend/DATABASE_SETUP.md`
- **API Reference**: See `Backend/API_ENDPOINTS.md`

## Testing

### Test Backend
1. Open Swagger UI: `http://localhost:5122/swagger`
2. Test `/api/Auth/register` to create user
3. Test `/api/Auth/login` to get JWT token
4. Use token to test protected endpoints

### Test Frontend
1. Open browser: `http://localhost:5173`
2. Register new account
3. Login with credentials
4. Browse cars and test filters

## Next Steps

### To Implement:
1. Car Detail Page
2. Test Drive Booking UI
3. Inquiry Form
4. Wishlist Page
5. Admin Dashboard
6. Admin Car Management
7. File Upload for Car Images
8. Email Notifications

## Troubleshooting

### Backend Issues
- **Cannot connect to SQL Server**: Check SQL Server service is running
- **Migration error**: Run `dotnet ef database update`
- **Port already in use**: Change port in `launchSettings.json`

### Frontend Issues
- **CORS error**: Verify backend CORS settings allow `http://localhost:5173`
- **API connection error**: Check backend is running on port 5122
- **401 Unauthorized**: Token expired, login again

## Development Workflow

1. Start Backend: `cd Backend && dotnet run`
2. Start Frontend: `cd Frontend && npm run dev`
3. Open browser: `http://localhost:5173`
4. Test API: `http://localhost:5122/swagger`

## Production Build

### Backend
```bash
cd Backend
dotnet publish -c Release
```

### Frontend
```bash
cd Frontend
npm run build
```

## License

Private project - Car Showroom Application

## Status

- Backend: Complete and Running
- Frontend: Basic Setup Complete
- Database: Schema Created
- Authentication: Working
- Car Listing: Working

**Last Updated**: 2026-01-05
