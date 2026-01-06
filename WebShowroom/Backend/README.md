# Car Showroom API - Backend

Backend API untuk aplikasi Car Showroom menggunakan ASP.NET Core Web API dengan Entity Framework Core dan SQL Server.

## Tech Stack

- **Framework**: ASP.NET Core 9.0 Web API
- **Database**: SQL Server (via SSMS)
- **ORM**: Entity Framework Core 9.0
- **Authentication**: JWT (JSON Web Token)
- **Password Hashing**: BCrypt.Net
- **API Documentation**: Swagger/OpenAPI

## Prerequisites

- .NET SDK 9.0 atau lebih tinggi
- SQL Server (LocalDB, Express, atau Full)
- SQL Server Management Studio (SSMS)

## Database Schema

### Tables:
1. **Users** - Data user/customer
2. **Admins** - Data admin
3. **Cars** - Data mobil
4. **CarImages** - Foto-foto mobil
5. **TestDrives** - Booking test drive
6. **Inquiries** - Pertanyaan dari user
7. **Wishlists** - Wishlist user

## Setup Instructions

### 1. Clone atau Navigate ke Project
```bash
cd Backend
```

### 2. Restore Dependencies
```bash
dotnet restore
```

### 3. Update Connection String
Edit file `appsettings.json` dan sesuaikan connection string dengan SQL Server Anda:

```json
"ConnectionStrings": {
  "DefaultConnection": "Server=localhost;Database=CarShowroomDB;Trusted_Connection=True;TrustServerCertificate=True;MultipleActiveResultSets=true"
}
```

**Catatan**: 
- Jika menggunakan SQL Server dengan authentication, ganti `Trusted_Connection=True` dengan `User Id=yourUsername;Password=yourPassword;`
- Sesuaikan `Server` dengan instance SQL Server Anda (contoh: `localhost\\SQLEXPRESS`)

### 4. Update Database (Jalankan Migration)
```bash
dotnet ef database update
```

Command ini akan:
- Membuat database `CarShowroomDB` di SQL Server
- Membuat semua tables yang diperlukan
- Setup relationships dan indexes

### 5. (Optional) Seed Data Admin
Untuk membuat admin pertama, Anda bisa jalankan query SQL berikut di SSMS:

```sql
USE CarShowroomDB;

-- Password: Admin123
INSERT INTO Admins (FullName, Email, PasswordHash, Role, CreatedAt, IsActive)
VALUES (
    'Super Admin',
    'admin@carshowroom.com',
    '$2a$11$XxXxXxXxXxXxXxXxXxXxXuXxXxXxXxXxXxXxXxXxXxXxXxXxXxXxXx',
    'Admin',
    GETUTCDATE(),
    1
);
```

**Catatan**: Anda perlu generate password hash menggunakan BCrypt. Atau gunakan endpoint register untuk membuat admin pertama.

### 6. Run Application
```bash
dotnet run
```

API akan berjalan di:
- HTTPS: `https://localhost:7xxx`
- HTTP: `http://localhost:5xxx`
- Swagger UI: `https://localhost:7xxx/swagger`

## API Endpoints

### Authentication
- `POST /api/Auth/register` - Register user baru
- `POST /api/Auth/login` - Login user
- `POST /api/Auth/admin/login` - Login admin

### Cars (Public & Admin)
- `GET /api/Cars` - Get all cars (dengan filter & sorting)
- `GET /api/Cars/{id}` - Get car detail
- `POST /api/Cars` - Create car (Admin only)
- `PUT /api/Cars/{id}` - Update car (Admin only)
- `DELETE /api/Cars/{id}` - Delete car (Admin only)

### Test Drives
- `GET /api/TestDrives` - Get user's test drives (User)
- `GET /api/TestDrives/all` - Get all test drives (Admin)
- `GET /api/TestDrives/{id}` - Get test drive detail
- `POST /api/TestDrives` - Create test drive booking (User)
- `PUT /api/TestDrives/{id}/status` - Update status (Admin)
- `DELETE /api/TestDrives/{id}` - Cancel test drive (User)

### Inquiries
- `GET /api/Inquiries` - Get user's inquiries (User)
- `GET /api/Inquiries/all` - Get all inquiries (Admin)
- `GET /api/Inquiries/{id}` - Get inquiry detail
- `POST /api/Inquiries` - Create inquiry (User)
- `PUT /api/Inquiries/{id}/response` - Respond to inquiry (Admin)
- `DELETE /api/Inquiries/{id}` - Delete inquiry (Admin)

### Wishlist
- `GET /api/Wishlist` - Get user's wishlist
- `POST /api/Wishlist/{carId}` - Add to wishlist
- `DELETE /api/Wishlist/{carId}` - Remove from wishlist
- `GET /api/Wishlist/check/{carId}` - Check if car in wishlist

## Authentication

API menggunakan JWT Bearer Token. Setelah login, gunakan token di header:

```
Authorization: Bearer {your-token-here}
```

## Project Structure

```
Backend/
├── Controllers/          # API Controllers
│   ├── AuthController.cs
│   ├── CarsController.cs
│   ├── TestDrivesController.cs
│   ├── InquiriesController.cs
│   └── WishlistController.cs
├── Models/              # Database Models
│   ├── User.cs
│   ├── Admin.cs
│   ├── Car.cs
│   ├── CarImage.cs
│   ├── TestDrive.cs
│   ├── Inquiry.cs
│   └── Wishlist.cs
├── DTOs/                # Data Transfer Objects
│   ├── AuthDTOs.cs
│   ├── CarDTOs.cs
│   └── TestDriveInquiryDTOs.cs
├── Data/                # DbContext
│   └── ApplicationDbContext.cs
├── Services/            # Business Logic Services
│   └── JwtService.cs
├── Migrations/          # EF Core Migrations
├── appsettings.json     # Configuration
└── Program.cs           # Application Entry Point
```

## Configuration

### JWT Settings (appsettings.json)
```json
"JwtSettings": {
  "SecretKey": "YourSuperSecretKeyForJWTTokenGeneration12345!",
  "Issuer": "CarShowroomAPI",
  "Audience": "CarShowroomClient",
  "ExpiryInMinutes": 1440
}
```

**PENTING**: Ganti `SecretKey` dengan key yang lebih aman untuk production!

### CORS Settings
CORS sudah dikonfigurasi untuk React frontend di:
- `http://localhost:3000` (Create React App)
- `http://localhost:5173` (Vite)

## Development

### Add New Migration
```bash
dotnet ef migrations add MigrationName
```

### Update Database
```bash
dotnet ef database update
```

### Remove Last Migration
```bash
dotnet ef migrations remove
```

### Build Project
```bash
dotnet build
```

### Run Tests (jika ada)
```bash
dotnet test
```

## Troubleshooting

### Error: Cannot connect to SQL Server
- Pastikan SQL Server service berjalan
- Cek connection string di `appsettings.json`
- Test koneksi menggunakan SSMS

### Error: Database already exists
```bash
dotnet ef database drop
dotnet ef database update
```

### Error: Migration pending
```bash
dotnet ef database update
```

## Next Steps

1. Setup Frontend React application
2. Implement file upload untuk car images
3. Add email notification service
4. Implement logging dan monitoring
5. Add unit tests dan integration tests

## License

Private project - Car Showroom Application
