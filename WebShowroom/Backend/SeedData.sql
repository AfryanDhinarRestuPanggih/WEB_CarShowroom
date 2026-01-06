-- =============================================
-- Car Showroom Database - Seed Data Script
-- =============================================

USE CarShowroomDB;
GO

-- =============================================
-- 1. Seed Admin Account
-- =============================================
-- Password: Admin123!
-- Note: You need to generate BCrypt hash for the password
-- Use online BCrypt generator or C# code to generate hash

PRINT 'Seeding Admin Account...';

-- Check if admin already exists
IF NOT EXISTS (SELECT 1 FROM Admins WHERE Email = 'admin@carshowroom.com')
BEGIN
    INSERT INTO Admins (FullName, Email, PasswordHash, Role, CreatedAt, IsActive)
    VALUES (
        'Super Admin',
        'admin@carshowroom.com',
        '$2a$11$vZ8rqXKzJ5L5qXKzJ5L5qeXKzJ5L5qXKzJ5L5qXKzJ5L5qXKzJ5L5q', -- Replace with actual BCrypt hash
        'Admin',
        GETUTCDATE(),
        1
    );
    PRINT 'Admin account created successfully!';
END
ELSE
BEGIN
    PRINT 'Admin account already exists.';
END
GO

-- =============================================
-- 2. Seed Sample Cars
-- =============================================
PRINT 'Seeding Sample Cars...';

-- Toyota Avanza
IF NOT EXISTS (SELECT 1 FROM Cars WHERE Brand = 'Toyota' AND Model = 'Avanza')
BEGIN
    INSERT INTO Cars (Brand, Model, Year, Price, Color, FuelType, Transmission, Mileage, EngineCapacity, Seats, BodyType, Description, Features, Stock, Status, IsFeatured, CreatedAt)
    VALUES (
        'Toyota', 'Avanza', 2024, 250000000, 'Silver', 'Bensin', 'Manual', 0, '1500cc', 7, 'MPV',
        'Toyota Avanza 2024 - MPV keluarga yang nyaman dan irit bahan bakar',
        'AC, Power Steering, Power Window, Central Lock, Audio System',
        5, 'Available', 1, GETUTCDATE()
    );
END

-- Honda CR-V
IF NOT EXISTS (SELECT 1 FROM Cars WHERE Brand = 'Honda' AND Model = 'CR-V')
BEGIN
    INSERT INTO Cars (Brand, Model, Year, Price, Color, FuelType, Transmission, Mileage, EngineCapacity, Seats, BodyType, Description, Features, Stock, Status, IsFeatured, CreatedAt)
    VALUES (
        'Honda', 'CR-V', 2024, 550000000, 'Black', 'Bensin', 'CVT', 0, '1500cc', 5, 'SUV',
        'Honda CR-V 2024 - SUV premium dengan teknologi terkini',
        'AC, Power Steering, Power Window, Central Lock, Audio System, Sunroof, Leather Seats, Cruise Control',
        3, 'Available', 1, GETUTCDATE()
    );
END

-- Mitsubishi Xpander
IF NOT EXISTS (SELECT 1 FROM Cars WHERE Brand = 'Mitsubishi' AND Model = 'Xpander')
BEGIN
    INSERT INTO Cars (Brand, Model, Year, Price, Color, FuelType, Transmission, Mileage, EngineCapacity, Seats, BodyType, Description, Features, Stock, Status, IsFeatured, CreatedAt)
    VALUES (
        'Mitsubishi', 'Xpander', 2024, 280000000, 'White', 'Bensin', 'Automatic', 0, '1500cc', 7, 'MPV',
        'Mitsubishi Xpander 2024 - MPV stylish dengan desain modern',
        'AC, Power Steering, Power Window, Central Lock, Audio System, Touchscreen Display',
        4, 'Available', 1, GETUTCDATE()
    );
END

-- Suzuki Ertiga
IF NOT EXISTS (SELECT 1 FROM Cars WHERE Brand = 'Suzuki' AND Model = 'Ertiga')
BEGIN
    INSERT INTO Cars (Brand, Model, Year, Price, Color, FuelType, Transmission, Mileage, EngineCapacity, Seats, BodyType, Description, Features, Stock, Status, IsFeatured, CreatedAt)
    VALUES (
        'Suzuki', 'Ertiga', 2024, 230000000, 'Blue', 'Bensin', 'Manual', 0, '1500cc', 7, 'MPV',
        'Suzuki Ertiga 2024 - MPV ekonomis untuk keluarga Indonesia',
        'AC, Power Steering, Power Window, Central Lock, Audio System',
        6, 'Available', 0, GETUTCDATE()
    );
END

-- Daihatsu Terios
IF NOT EXISTS (SELECT 1 FROM Cars WHERE Brand = 'Daihatsu' AND Model = 'Terios')
BEGIN
    INSERT INTO Cars (Brand, Model, Year, Price, Color, FuelType, Transmission, Mileage, EngineCapacity, Seats, BodyType, Description, Features, Stock, Status, IsFeatured, CreatedAt)
    VALUES (
        'Daihatsu', 'Terios', 2024, 270000000, 'Red', 'Bensin', 'Automatic', 0, '1500cc', 7, 'SUV',
        'Daihatsu Terios 2024 - SUV tangguh untuk petualangan keluarga',
        'AC, Power Steering, Power Window, Central Lock, Audio System, Fog Lamp',
        3, 'Available', 0, GETUTCDATE()
    );
END

PRINT 'Sample cars seeded successfully!';
GO

-- =============================================
-- 3. Seed Test User (Optional)
-- =============================================
PRINT 'Seeding Test User...';

-- Password: User123!
IF NOT EXISTS (SELECT 1 FROM Users WHERE Email = 'user@test.com')
BEGIN
    INSERT INTO Users (FullName, Email, PasswordHash, PhoneNumber, Address, CreatedAt, IsActive)
    VALUES (
        'Test User',
        'user@test.com',
        '$2a$11$vZ8rqXKzJ5L5qXKzJ5L5qeXKzJ5L5qXKzJ5L5qXKzJ5L5qXKzJ5L5q', -- Replace with actual BCrypt hash
        '081234567890',
        'Jakarta, Indonesia',
        GETUTCDATE(),
        1
    );
    PRINT 'Test user created successfully!';
END
ELSE
BEGIN
    PRINT 'Test user already exists.';
END
GO

PRINT '=============================================';
PRINT 'Database seeding completed!';
PRINT '=============================================';
PRINT '';
PRINT 'Default Credentials:';
PRINT 'Admin: admin@carshowroom.com / Admin123!';
PRINT 'User: user@test.com / User123!';
PRINT '';
PRINT 'IMPORTANT: Please generate proper BCrypt hashes for passwords!';
PRINT 'You can use the API endpoint /api/Auth/register to create accounts with proper password hashing.';
GO
