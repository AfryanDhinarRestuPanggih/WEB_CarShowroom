-- Insert Sample Cars Data for Testing
USE CarShowroomDB;
GO

-- Check if cars already exist
IF NOT EXISTS (SELECT 1 FROM Cars)
BEGIN
    -- Insert Toyota Avanza
    INSERT INTO Cars (Brand, Model, Year, Price, Color, FuelType, Transmission, Mileage, EngineCapacity, Seats, BodyType, Description, Features, Stock, Status, IsFeatured, CreatedAt)
    VALUES 
    ('Toyota', 'Avanza', 2024, 250000000, 'Silver', 'Bensin', 'Manual', 0, '1500cc', 7, 'MPV', 
     'Toyota Avanza 2024 - MPV keluarga yang nyaman dan irit bahan bakar dengan desain modern', 
     'AC, Power Steering, Power Window, Central Lock, Audio System, Airbags', 5, 'Available', 1, GETUTCDATE());

    -- Insert Honda CR-V
    INSERT INTO Cars (Brand, Model, Year, Price, Color, FuelType, Transmission, Mileage, EngineCapacity, Seats, BodyType, Description, Features, Stock, Status, IsFeatured, CreatedAt)
    VALUES 
    ('Honda', 'CR-V', 2024, 550000000, 'Black', 'Bensin', 'CVT', 0, '1500cc', 5, 'SUV', 
     'Honda CR-V 2024 - SUV premium dengan teknologi terkini dan performa maksimal', 
     'AC, Power Steering, Power Window, Central Lock, Audio System, Sunroof, Leather Seats, Cruise Control, Honda Sensing', 3, 'Available', 1, GETUTCDATE());

    -- Insert Mitsubishi Xpander
    INSERT INTO Cars (Brand, Model, Year, Price, Color, FuelType, Transmission, Mileage, EngineCapacity, Seats, BodyType, Description, Features, Stock, Status, IsFeatured, CreatedAt)
    VALUES 
    ('Mitsubishi', 'Xpander', 2024, 280000000, 'White', 'Bensin', 'Automatic', 0, '1500cc', 7, 'MPV', 
     'Mitsubishi Xpander 2024 - MPV stylish dengan desain modern dan kabin luas', 
     'AC, Power Steering, Power Window, Central Lock, Audio System, Touchscreen Display, Rear Camera', 4, 'Available', 1, GETUTCDATE());

    -- Insert Suzuki Ertiga
    INSERT INTO Cars (Brand, Model, Year, Price, Color, FuelType, Transmission, Mileage, EngineCapacity, Seats, BodyType, Description, Features, Stock, Status, IsFeatured, CreatedAt)
    VALUES 
    ('Suzuki', 'Ertiga', 2024, 230000000, 'Blue', 'Bensin', 'Manual', 0, '1500cc', 7, 'MPV', 
     'Suzuki Ertiga 2024 - MPV ekonomis untuk keluarga Indonesia dengan efisiensi bahan bakar terbaik', 
     'AC, Power Steering, Power Window, Central Lock, Audio System', 6, 'Available', 0, GETUTCDATE());

    -- Insert Daihatsu Terios
    INSERT INTO Cars (Brand, Model, Year, Price, Color, FuelType, Transmission, Mileage, EngineCapacity, Seats, BodyType, Description, Features, Stock, Status, IsFeatured, CreatedAt)
    VALUES 
    ('Daihatsu', 'Terios', 2024, 270000000, 'Red', 'Bensin', 'Automatic', 0, '1500cc', 7, 'SUV', 
     'Daihatsu Terios 2024 - SUV tangguh untuk petualangan keluarga dengan ground clearance tinggi', 
     'AC, Power Steering, Power Window, Central Lock, Audio System, Fog Lamp, Roof Rack', 3, 'Available', 0, GETUTCDATE());

    -- Insert Toyota Fortuner
    INSERT INTO Cars (Brand, Model, Year, Price, Color, FuelType, Transmission, Mileage, EngineCapacity, Seats, BodyType, Description, Features, Stock, Status, IsFeatured, CreatedAt)
    VALUES 
    ('Toyota', 'Fortuner', 2024, 650000000, 'White', 'Diesel', 'Automatic', 0, '2400cc', 7, 'SUV', 
     'Toyota Fortuner 2024 - SUV premium dengan mesin diesel bertenaga dan interior mewah', 
     'AC, Power Steering, Power Window, Central Lock, Audio System, Leather Seats, Sunroof, 4WD, Hill Start Assist', 2, 'Available', 1, GETUTCDATE());

    PRINT 'Sample cars data inserted successfully!';
END
ELSE
BEGIN
    PRINT 'Cars data already exists. Skipping insert.';
END
GO
