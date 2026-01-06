# API Endpoints Reference - Car Showroom

Base URL: `https://localhost:7xxx` atau `http://localhost:5xxx`

## Authentication

Semua endpoint yang memerlukan authentication harus menyertakan JWT token di header:
```
Authorization: Bearer {your-jwt-token}
```

---

## 1. Authentication Endpoints

### Register User
**POST** `/api/Auth/register`

**Request Body:**
```json
{
  "fullName": "John Doe",
  "email": "john@example.com",
  "password": "Password123!",
  "phoneNumber": "081234567890",
  "address": "Jakarta, Indonesia"
}
```

**Response:** `200 OK`
```json
{
  "id": 1,
  "fullName": "John Doe",
  "email": "john@example.com",
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "role": "User"
}
```

---

### Login User
**POST** `/api/Auth/login`

**Request Body:**
```json
{
  "email": "john@example.com",
  "password": "Password123!"
}
```

**Response:** `200 OK`
```json
{
  "id": 1,
  "fullName": "John Doe",
  "email": "john@example.com",
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "role": "User"
}
```

---

### Login Admin
**POST** `/api/Auth/admin/login`

**Request Body:**
```json
{
  "email": "admin@carshowroom.com",
  "password": "Admin123!"
}
```

**Response:** `200 OK`
```json
{
  "id": 1,
  "fullName": "Admin User",
  "email": "admin@carshowroom.com",
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "role": "Admin"
}
```

---

## 2. Cars Endpoints

### Get All Cars (Public)
**GET** `/api/Cars`

**Query Parameters:**
- `brand` (string) - Filter by brand
- `bodyType` (string) - Filter by body type (SUV, MPV, Sedan, etc.)
- `fuelType` (string) - Filter by fuel type (Bensin, Diesel, Hybrid, Electric)
- `transmission` (string) - Filter by transmission (Manual, Automatic, CVT)
- `minPrice` (decimal) - Minimum price
- `maxPrice` (decimal) - Maximum price
- `minYear` (int) - Minimum year
- `maxYear` (int) - Maximum year
- `isFeatured` (bool) - Filter featured cars
- `sortBy` (string) - Sort field (price, year, brand, createdAt)
- `sortOrder` (string) - Sort order (asc, desc)

**Example:**
```
GET /api/Cars?brand=Toyota&minPrice=200000000&maxPrice=300000000&sortBy=price&sortOrder=asc
```

**Response:** `200 OK`
```json
[
  {
    "id": 1,
    "brand": "Toyota",
    "model": "Avanza",
    "year": 2024,
    "price": 250000000,
    "color": "Silver",
    "fuelType": "Bensin",
    "transmission": "Manual",
    "mileage": 0,
    "engineCapacity": "1500cc",
    "seats": 7,
    "bodyType": "MPV",
    "description": "Toyota Avanza 2024 - MPV keluarga yang nyaman",
    "features": "AC, Power Steering, Power Window",
    "stock": 5,
    "status": "Available",
    "isFeatured": true,
    "createdAt": "2024-01-05T00:00:00Z",
    "images": [
      {
        "id": 1,
        "imageUrl": "https://example.com/car1.jpg",
        "isPrimary": true,
        "displayOrder": 0
      }
    ]
  }
]
```

---

### Get Car Detail
**GET** `/api/Cars/{id}`

**Response:** `200 OK`
```json
{
  "id": 1,
  "brand": "Toyota",
  "model": "Avanza",
  "year": 2024,
  "price": 250000000,
  "color": "Silver",
  "fuelType": "Bensin",
  "transmission": "Manual",
  "mileage": 0,
  "engineCapacity": "1500cc",
  "seats": 7,
  "bodyType": "MPV",
  "description": "Toyota Avanza 2024 - MPV keluarga yang nyaman",
  "features": "AC, Power Steering, Power Window",
  "stock": 5,
  "status": "Available",
  "isFeatured": true,
  "createdAt": "2024-01-05T00:00:00Z",
  "images": []
}
```

---

### Create Car (Admin Only)
**POST** `/api/Cars`

**Authorization:** Required (Admin)

**Request Body:**
```json
{
  "brand": "Toyota",
  "model": "Avanza",
  "year": 2024,
  "price": 250000000,
  "color": "Silver",
  "fuelType": "Bensin",
  "transmission": "Manual",
  "mileage": 0,
  "engineCapacity": "1500cc",
  "seats": 7,
  "bodyType": "MPV",
  "description": "Toyota Avanza 2024 - MPV keluarga yang nyaman",
  "features": "AC, Power Steering, Power Window",
  "stock": 5,
  "isFeatured": true
}
```

**Response:** `201 Created`

---

### Update Car (Admin Only)
**PUT** `/api/Cars/{id}`

**Authorization:** Required (Admin)

**Request Body:** (All fields optional)
```json
{
  "price": 240000000,
  "stock": 3,
  "status": "Available"
}
```

**Response:** `200 OK`
```json
{
  "message": "Car updated successfully"
}
```

---

### Delete Car (Admin Only)
**DELETE** `/api/Cars/{id}`

**Authorization:** Required (Admin)

**Response:** `200 OK`
```json
{
  "message": "Car deleted successfully"
}
```

---

## 3. Test Drive Endpoints

### Get User's Test Drives
**GET** `/api/TestDrives`

**Authorization:** Required (User)

**Response:** `200 OK`
```json
[
  {
    "id": 1,
    "userId": 1,
    "userName": "John Doe",
    "userEmail": "john@example.com",
    "userPhone": "081234567890",
    "carId": 1,
    "carBrand": "Toyota",
    "carModel": "Avanza",
    "requestedDate": "2024-01-10T00:00:00Z",
    "requestedTime": "10:00",
    "status": "Pending",
    "notes": "Saya ingin test drive di pagi hari",
    "adminNotes": null,
    "createdAt": "2024-01-05T00:00:00Z"
  }
]
```

---

### Get All Test Drives (Admin)
**GET** `/api/TestDrives/all?status=Pending`

**Authorization:** Required (Admin)

**Query Parameters:**
- `status` (string) - Filter by status (Pending, Approved, Rejected, Completed, Cancelled)

**Response:** `200 OK` (Same format as above)

---

### Create Test Drive Booking
**POST** `/api/TestDrives`

**Authorization:** Required (User)

**Request Body:**
```json
{
  "carId": 1,
  "requestedDate": "2024-01-10T00:00:00Z",
  "requestedTime": "10:00",
  "notes": "Saya ingin test drive di pagi hari"
}
```

**Response:** `201 Created`

---

### Update Test Drive Status (Admin)
**PUT** `/api/TestDrives/{id}/status`

**Authorization:** Required (Admin)

**Request Body:**
```json
{
  "status": "Approved",
  "adminNotes": "Test drive disetujui untuk tanggal 10 Januari 2024 jam 10:00"
}
```

**Response:** `200 OK`
```json
{
  "message": "Test drive status updated successfully"
}
```

---

### Cancel Test Drive (User)
**DELETE** `/api/TestDrives/{id}`

**Authorization:** Required (User)

**Response:** `200 OK`
```json
{
  "message": "Test drive cancelled successfully"
}
```

---

## 4. Inquiry Endpoints

### Get User's Inquiries
**GET** `/api/Inquiries`

**Authorization:** Required (User)

**Response:** `200 OK`
```json
[
  {
    "id": 1,
    "userId": 1,
    "userName": "John Doe",
    "userEmail": "john@example.com",
    "carId": 1,
    "carBrand": "Toyota",
    "carModel": "Avanza",
    "subject": "Pertanyaan tentang harga",
    "message": "Apakah harga bisa nego?",
    "status": "Pending",
    "adminResponse": null,
    "createdAt": "2024-01-05T00:00:00Z",
    "updatedAt": null
  }
]
```

---

### Get All Inquiries (Admin)
**GET** `/api/Inquiries/all?status=Pending`

**Authorization:** Required (Admin)

**Query Parameters:**
- `status` (string) - Filter by status (Pending, Responded, Resolved, Closed)

**Response:** `200 OK` (Same format as above)

---

### Create Inquiry
**POST** `/api/Inquiries`

**Authorization:** Required (User)

**Request Body:**
```json
{
  "carId": 1,
  "subject": "Pertanyaan tentang harga",
  "message": "Apakah harga bisa nego?"
}
```

**Response:** `201 Created`

---

### Respond to Inquiry (Admin)
**PUT** `/api/Inquiries/{id}/response`

**Authorization:** Required (Admin)

**Request Body:**
```json
{
  "adminResponse": "Harga bisa nego, silakan hubungi sales kami",
  "status": "Responded"
}
```

**Response:** `200 OK`
```json
{
  "message": "Inquiry response sent successfully"
}
```

---

## 5. Wishlist Endpoints

### Get User's Wishlist
**GET** `/api/Wishlist`

**Authorization:** Required (User)

**Response:** `200 OK`
```json
[
  {
    "id": 1,
    "brand": "Toyota",
    "model": "Avanza",
    "year": 2024,
    "price": 250000000,
    "images": []
  }
]
```

---

### Add to Wishlist
**POST** `/api/Wishlist/{carId}`

**Authorization:** Required (User)

**Response:** `200 OK`
```json
{
  "message": "Car added to wishlist successfully"
}
```

---

### Remove from Wishlist
**DELETE** `/api/Wishlist/{carId}`

**Authorization:** Required (User)

**Response:** `200 OK`
```json
{
  "message": "Car removed from wishlist successfully"
}
```

---

### Check if Car in Wishlist
**GET** `/api/Wishlist/check/{carId}`

**Authorization:** Required (User)

**Response:** `200 OK`
```json
{
  "inWishlist": true
}
```

---

## Error Responses

### 400 Bad Request
```json
{
  "message": "Validation error message"
}
```

### 401 Unauthorized
```json
{
  "message": "Invalid email or password"
}
```

### 403 Forbidden
```json
{
  "message": "Access denied"
}
```

### 404 Not Found
```json
{
  "message": "Resource not found"
}
```

### 500 Internal Server Error
```json
{
  "message": "An error occurred"
}
```
