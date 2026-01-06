# Setup Database - Car Showroom API

Panduan lengkap untuk setup database SQL Server untuk aplikasi Car Showroom.

## Langkah 1: Pastikan SQL Server Berjalan

1. Buka **SQL Server Management Studio (SSMS)**
2. Connect ke SQL Server instance Anda
3. Pastikan service SQL Server berjalan

## Langkah 2: Update Connection String

Edit file `appsettings.json` di folder Backend:

```json
"ConnectionStrings": {
  "DefaultConnection": "Server=localhost;Database=CarShowroomDB;Trusted_Connection=True;TrustServerCertificate=True;MultipleActiveResultSets=true"
}
```

**Sesuaikan dengan environment Anda:**

### Jika menggunakan SQL Server Express:
```
Server=localhost\\SQLEXPRESS;Database=CarShowroomDB;Trusted_Connection=True;TrustServerCertificate=True;MultipleActiveResultSets=true
```

### Jika menggunakan SQL Authentication:
```
Server=localhost;Database=CarShowroomDB;User Id=sa;Password=YourPassword;TrustServerCertificate=True;MultipleActiveResultSets=true
```

## Langkah 3: Jalankan Migration

Buka terminal/command prompt di folder Backend, lalu jalankan:

```bash
dotnet ef database update
```

Command ini akan:
- ✅ Membuat database `CarShowroomDB`
- ✅ Membuat semua tables (Users, Admins, Cars, TestDrives, Inquiries, Wishlists, CarImages)
- ✅ Setup relationships dan indexes
- ✅ Apply semua migrations

## Langkah 4: Verifikasi Database

Buka SSMS dan cek:

```sql
USE CarShowroomDB;

-- Cek semua tables
SELECT TABLE_NAME 
FROM INFORMATION_SCHEMA.TABLES 
WHERE TABLE_TYPE = 'BASE TABLE';

-- Expected tables:
-- - Users
-- - Admins
-- - Cars
-- - CarImages
-- - TestDrives
-- - Inquiries
-- - Wishlists
-- - __EFMigrationsHistory
```

## Langkah 5: Seed Data (Optional)

### Option A: Menggunakan API (Recommended)

Jalankan aplikasi terlebih dahulu:
```bash
dotnet run
```

Kemudian gunakan Swagger UI atau Postman untuk register admin:

**POST** `https://localhost:7xxx/api/Auth/register`
```json
{
  "fullName": "Admin User",
  "email": "admin@carshowroom.com",
  "password": "Admin123!",
  "phoneNumber": "081234567890"
}
```

### Option B: Menggunakan SQL Script

1. Buka file `SeedData.sql` di folder Backend
2. **PENTING**: Generate BCrypt hash untuk password terlebih dahulu
3. Jalankan script di SSMS

#### Cara Generate BCrypt Hash:

**Menggunakan C# Console:**
```csharp
using BCrypt.Net;

string password = "Admin123!";
string hash = BCrypt.Net.BCrypt.HashPassword(password);
Console.WriteLine(hash);
```

**Atau gunakan online BCrypt generator:**
- https://bcrypt-generator.com/
- Pilih rounds: 11
- Input password: `Admin123!`
- Copy hash yang dihasilkan

3. Replace hash di `SeedData.sql`:
```sql
INSERT INTO Admins (FullName, Email, PasswordHash, Role, CreatedAt, IsActive)
VALUES (
    'Super Admin',
    'admin@carshowroom.com',
    'PASTE_YOUR_BCRYPT_HASH_HERE',  -- Replace this
    'Admin',
    GETUTCDATE(),
    1
);
```

4. Jalankan script di SSMS

## Langkah 6: Test Connection

Jalankan aplikasi:
```bash
cd Backend
dotnet run
```

Buka browser dan akses Swagger UI:
```
https://localhost:7xxx/swagger
```

Test endpoint:
- GET `/api/Cars` - Harus return empty array atau data cars
- POST `/api/Auth/register` - Test register user baru

## Troubleshooting

### Error: "Cannot open database"
**Solusi:**
- Pastikan SQL Server service berjalan
- Cek connection string di `appsettings.json`
- Test connection di SSMS

### Error: "Login failed for user"
**Solusi:**
- Jika menggunakan Windows Authentication: Pastikan `Trusted_Connection=True`
- Jika menggunakan SQL Authentication: Gunakan `User Id` dan `Password`
- Pastikan user memiliki permission untuk create database

### Error: "A network-related or instance-specific error"
**Solusi:**
- Pastikan SQL Server Browser service berjalan
- Enable TCP/IP di SQL Server Configuration Manager
- Cek firewall settings

### Error: "The certificate chain was issued by an authority that is not trusted"
**Solusi:**
- Tambahkan `TrustServerCertificate=True` di connection string

## Database Schema Overview

```
Users (Customer accounts)
├── Id (PK)
├── FullName
├── Email (Unique)
├── PasswordHash
├── PhoneNumber
├── Address
└── IsActive

Admins (Admin accounts)
├── Id (PK)
├── FullName
├── Email (Unique)
├── PasswordHash
├── Role
└── IsActive

Cars (Vehicle inventory)
├── Id (PK)
├── Brand
├── Model
├── Year
├── Price
├── Color
├── FuelType
├── Transmission
├── Stock
└── Status

CarImages (Car photos)
├── Id (PK)
├── CarId (FK → Cars)
├── ImageUrl
├── IsPrimary
└── DisplayOrder

TestDrives (Test drive bookings)
├── Id (PK)
├── UserId (FK → Users)
├── CarId (FK → Cars)
├── RequestedDate
├── RequestedTime
└── Status

Inquiries (Customer inquiries)
├── Id (PK)
├── UserId (FK → Users)
├── CarId (FK → Cars)
├── Subject
├── Message
├── Status
└── AdminResponse

Wishlists (User favorites)
├── Id (PK)
├── UserId (FK → Users)
└── CarId (FK → Cars)
```

## Next Steps

Setelah database berhasil di-setup:

1. ✅ Test semua API endpoints di Swagger
2. ✅ Create admin account
3. ✅ Add sample cars data
4. ✅ Setup frontend React application
5. ✅ Connect frontend dengan backend API

## Useful SQL Queries

### Check all users
```sql
SELECT * FROM Users;
```

### Check all admins
```sql
SELECT * FROM Admins;
```

### Check all cars
```sql
SELECT * FROM Cars;
```

### Check test drive bookings
```sql
SELECT td.*, u.FullName as UserName, c.Brand, c.Model
FROM TestDrives td
JOIN Users u ON td.UserId = u.Id
JOIN Cars c ON td.CarId = c.Id
ORDER BY td.CreatedAt DESC;
```

### Check inquiries
```sql
SELECT i.*, u.FullName as UserName, c.Brand, c.Model
FROM Inquiries i
JOIN Users u ON i.UserId = u.Id
JOIN Cars c ON i.CarId = c.Id
ORDER BY i.CreatedAt DESC;
```
