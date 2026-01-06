using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using CarShowroomAPI.Data;
using CarShowroomAPI.Models;
using BCrypt.Net;

namespace CarShowroomAPI.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class SeedController : ControllerBase
    {
        private readonly ApplicationDbContext _context;

        public SeedController(ApplicationDbContext context)
        {
            _context = context;
        }

        // POST: api/Seed/admin
        [HttpPost("admin")]
        public async Task<IActionResult> SeedAdmin()
        {
            var adminEmail = "admin@carshowroom.com";
            
            var existingAdmin = await _context.Admins.FirstOrDefaultAsync(a => a.Email == adminEmail);
            
            if (existingAdmin != null)
            {
                return Ok(new { message = "Admin already exists", email = adminEmail });
            }

            var admin = new Admin
            {
                FullName = "Super Admin",
                Email = adminEmail,
                PasswordHash = BCrypt.Net.BCrypt.HashPassword("Admin123!"),
                Role = "Admin",
                CreatedAt = DateTime.UtcNow,
                IsActive = true
            };

            _context.Admins.Add(admin);
            await _context.SaveChangesAsync();

            return Ok(new { message = "Admin account created successfully!", email = adminEmail, password = "Admin123!" });
        }

        // POST: api/Seed/admin/reset
        [HttpPost("admin/reset")]
        public async Task<IActionResult> ResetAdmin()
        {
            var adminEmail = "admin@carshowroom.com";
            
            var existingAdmin = await _context.Admins.FirstOrDefaultAsync(a => a.Email == adminEmail);
            
            if (existingAdmin != null)
            {
                _context.Admins.Remove(existingAdmin);
                await _context.SaveChangesAsync();
            }

            var admin = new Admin
            {
                FullName = "Super Admin",
                Email = adminEmail,
                PasswordHash = BCrypt.Net.BCrypt.HashPassword("Admin123!"),
                Role = "Admin",
                CreatedAt = DateTime.UtcNow,
                IsActive = true
            };

            _context.Admins.Add(admin);
            await _context.SaveChangesAsync();

            return Ok(new { message = "Admin account reset successfully!", email = adminEmail, password = "Admin123!" });
        }

        // POST: api/Seed/cars
        [HttpPost("cars")]
        public async Task<IActionResult> SeedCars()
        {
            // Check if cars already exist
            if (_context.Cars.Any())
            {
                return Ok(new { message = "Cars already exist in database", count = _context.Cars.Count() });
            }

            var cars = new List<Car>
            {
                new Car
                {
                    Brand = "Toyota",
                    Model = "Avanza",
                    Year = 2024,
                    Price = 250000000,
                    Color = "Silver",
                    FuelType = "Bensin",
                    Transmission = "Manual",
                    Mileage = 0,
                    EngineCapacity = "1500cc",
                    Seats = 7,
                    BodyType = "MPV",
                    Description = "Toyota Avanza 2024 - MPV keluarga yang nyaman dan irit bahan bakar dengan desain modern",
                    Features = "AC, Power Steering, Power Window, Central Lock, Audio System, Airbags",
                    Stock = 5,
                    Status = "Available",
                    IsFeatured = true,
                    CreatedAt = DateTime.UtcNow
                },
                new Car
                {
                    Brand = "Honda",
                    Model = "CR-V",
                    Year = 2024,
                    Price = 550000000,
                    Color = "Black",
                    FuelType = "Bensin",
                    Transmission = "CVT",
                    Mileage = 0,
                    EngineCapacity = "1500cc",
                    Seats = 5,
                    BodyType = "SUV",
                    Description = "Honda CR-V 2024 - SUV premium dengan teknologi terkini dan performa maksimal",
                    Features = "AC, Power Steering, Power Window, Central Lock, Audio System, Sunroof, Leather Seats, Cruise Control, Honda Sensing",
                    Stock = 3,
                    Status = "Available",
                    IsFeatured = true,
                    CreatedAt = DateTime.UtcNow
                },
                new Car
                {
                    Brand = "Mitsubishi",
                    Model = "Xpander",
                    Year = 2024,
                    Price = 280000000,
                    Color = "White",
                    FuelType = "Bensin",
                    Transmission = "Automatic",
                    Mileage = 0,
                    EngineCapacity = "1500cc",
                    Seats = 7,
                    BodyType = "MPV",
                    Description = "Mitsubishi Xpander 2024 - MPV stylish dengan desain modern dan kabin luas",
                    Features = "AC, Power Steering, Power Window, Central Lock, Audio System, Touchscreen Display, Rear Camera",
                    Stock = 4,
                    Status = "Available",
                    IsFeatured = true,
                    CreatedAt = DateTime.UtcNow
                },
                new Car
                {
                    Brand = "Suzuki",
                    Model = "Ertiga",
                    Year = 2024,
                    Price = 230000000,
                    Color = "Blue",
                    FuelType = "Bensin",
                    Transmission = "Manual",
                    Mileage = 0,
                    EngineCapacity = "1500cc",
                    Seats = 7,
                    BodyType = "MPV",
                    Description = "Suzuki Ertiga 2024 - MPV ekonomis untuk keluarga Indonesia dengan efisiensi bahan bakar terbaik",
                    Features = "AC, Power Steering, Power Window, Central Lock, Audio System",
                    Stock = 6,
                    Status = "Available",
                    IsFeatured = false,
                    CreatedAt = DateTime.UtcNow
                },
                new Car
                {
                    Brand = "Daihatsu",
                    Model = "Terios",
                    Year = 2024,
                    Price = 270000000,
                    Color = "Red",
                    FuelType = "Bensin",
                    Transmission = "Automatic",
                    Mileage = 0,
                    EngineCapacity = "1500cc",
                    Seats = 7,
                    BodyType = "SUV",
                    Description = "Daihatsu Terios 2024 - SUV tangguh untuk petualangan keluarga dengan ground clearance tinggi",
                    Features = "AC, Power Steering, Power Window, Central Lock, Audio System, Fog Lamp, Roof Rack",
                    Stock = 3,
                    Status = "Available",
                    IsFeatured = false,
                    CreatedAt = DateTime.UtcNow
                },
                new Car
                {
                    Brand = "Toyota",
                    Model = "Fortuner",
                    Year = 2024,
                    Price = 650000000,
                    Color = "White",
                    FuelType = "Diesel",
                    Transmission = "Automatic",
                    Mileage = 0,
                    EngineCapacity = "2400cc",
                    Seats = 7,
                    BodyType = "SUV",
                    Description = "Toyota Fortuner 2024 - SUV premium dengan mesin diesel bertenaga dan interior mewah",
                    Features = "AC, Power Steering, Power Window, Central Lock, Audio System, Leather Seats, Sunroof, 4WD, Hill Start Assist",
                    Stock = 2,
                    Status = "Available",
                    IsFeatured = true,
                    CreatedAt = DateTime.UtcNow
                }
            };

            _context.Cars.AddRange(cars);
            await _context.SaveChangesAsync();

            return Ok(new { message = "Sample cars seeded successfully", count = cars.Count });
        }
    }
}
