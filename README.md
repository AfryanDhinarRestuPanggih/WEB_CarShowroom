# WEB CarShowroom 🚗

Aplikasi **E-Showroom Mobil Berbasis Web** yang dikembangkan sebagai tugas mata kuliah  
**Pemrograman Visual Desktop**.

Aplikasi ini menerapkan konsep **full-stack web modern** dengan integrasi  
**ASP.NET Core Web API** sebagai backend dan **React** sebagai frontend.

---


## 🎥 Video Demo Aplikasi

Video demo penggunaan aplikasi WEB CarShowroom dapat diakses melalui link berikut:

🔗 YouTube: **Coming Soon**  

## 📌 Deskripsi Singkat

WEB CarShowroom adalah sistem showroom mobil digital yang memungkinkan customer
melihat katalog mobil, melakukan pembelian, wishlist, serta pengajuan test drive
secara online.  
Di sisi lain, admin dapat mengelola data mobil, transaksi, test drive, dan inquiry
melalui dashboard terpusat.

---

## 🎯 Tujuan Pembuatan Sistem

- Menyediakan sistem penjualan mobil berbasis web yang terintegrasi
- Mempermudah customer dalam melihat dan membeli mobil secara online
- Membantu admin dalam mengelola data mobil dan transaksi
- Menyediakan informasi transaksi secara real-time
- Menerapkan konsep full-stack sesuai praktik industri

---

## 🧩 Gambaran Umum Sistem

Aplikasi memiliki dua jenis pengguna:

### 👤 User (Customer)
- Registrasi dan login
- Melihat katalog dan detail mobil
- Melakukan pembelian mobil
- Upload bukti pembayaran
- Wishlist mobil
- Pengajuan test drive
- Inquiry ke admin
- Melihat riwayat transaksi

### 🛠️ Admin
- Login admin
- Dashboard admin
- CRUD data mobil
- Verifikasi pembayaran
- Manajemen transaksi pembelian
- Manajemen test drive
- Manajemen inquiry customer
- Monitoring aktivitas sistem

---

## ⚙️ Teknologi yang Digunakan

### Backend
- ASP.NET Core Web API
- C#
- Entity Framework Core
- JWT Authentication
- SQL Server

### Frontend
- React JS
- Vite
- JavaScript
- CSS

---

## 🗄️ Database

Database menggunakan **SQL Server** dengan tabel utama:
- Users
- Admins
- Cars
- CarImages
- Transactions
- Payments
- TestDrives
- Inquiries
- Wishlists

---


 ## 🚀 Menjalankan Aplikasi

### Backend
Backend dijalankan menggunakan perintah berikut:
```
dotnet run
```
Aplikasi backend akan berjalan pada:  
```
http://localhost:5122
```
### Frontend  
Frontend dijalankan menggunakan perintah berikut:
```
npm run dev
```
Aplikasi Frontend akan berjalan pada:  
```
http://localhost:5173
```
