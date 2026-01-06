using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.Authorization;
using Microsoft.EntityFrameworkCore;
using CarShowroomAPI.Data;
using CarShowroomAPI.Models;
using CarShowroomAPI.DTOs;
using System.Security.Claims;

namespace CarShowroomAPI.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class CarsController : ControllerBase
    {
        private readonly ApplicationDbContext _context;

        public CarsController(ApplicationDbContext context)
        {
            _context = context;
        }

        // GET: api/Cars
        [HttpGet]
        public async Task<ActionResult<IEnumerable<CarResponseDto>>> GetCars(
            [FromQuery] string? brand,
            [FromQuery] string? bodyType,
            [FromQuery] string? fuelType,
            [FromQuery] string? transmission,
            [FromQuery] decimal? minPrice,
            [FromQuery] decimal? maxPrice,
            [FromQuery] int? minYear,
            [FromQuery] int? maxYear,
            [FromQuery] bool? isFeatured,
            [FromQuery] string? sortBy = "createdAt",
            [FromQuery] string? sortOrder = "desc")
        {
            var query = _context.Cars
                .Include(c => c.CarImages)
                .Where(c => c.Status == "Available")
                .AsQueryable();

            // Apply filters
            if (!string.IsNullOrEmpty(brand))
                query = query.Where(c => c.Brand.ToLower().Contains(brand.ToLower()));

            if (!string.IsNullOrEmpty(bodyType))
                query = query.Where(c => c.BodyType == bodyType);

            if (!string.IsNullOrEmpty(fuelType))
                query = query.Where(c => c.FuelType == fuelType);

            if (!string.IsNullOrEmpty(transmission))
                query = query.Where(c => c.Transmission == transmission);

            if (minPrice.HasValue)
                query = query.Where(c => c.Price >= minPrice.Value);

            if (maxPrice.HasValue)
                query = query.Where(c => c.Price <= maxPrice.Value);

            if (minYear.HasValue)
                query = query.Where(c => c.Year >= minYear.Value);

            if (maxYear.HasValue)
                query = query.Where(c => c.Year <= maxYear.Value);

            if (isFeatured.HasValue)
                query = query.Where(c => c.IsFeatured == isFeatured.Value);

            // Apply sorting
            query = sortBy?.ToLower() switch
            {
                "price" => sortOrder?.ToLower() == "asc" 
                    ? query.OrderBy(c => c.Price) 
                    : query.OrderByDescending(c => c.Price),
                "year" => sortOrder?.ToLower() == "asc" 
                    ? query.OrderBy(c => c.Year) 
                    : query.OrderByDescending(c => c.Year),
                "brand" => sortOrder?.ToLower() == "asc" 
                    ? query.OrderBy(c => c.Brand) 
                    : query.OrderByDescending(c => c.Brand),
                _ => sortOrder?.ToLower() == "asc" 
                    ? query.OrderBy(c => c.CreatedAt) 
                    : query.OrderByDescending(c => c.CreatedAt)
            };

            var cars = await query.ToListAsync();

            var response = cars.Select(c => new CarResponseDto
            {
                Id = c.Id,
                Brand = c.Brand,
                Model = c.Model,
                Year = c.Year,
                Price = c.Price,
                Color = c.Color,
                FuelType = c.FuelType,
                Transmission = c.Transmission,
                Mileage = c.Mileage,
                EngineCapacity = c.EngineCapacity,
                Seats = c.Seats,
                BodyType = c.BodyType,
                Description = c.Description,
                Features = c.Features,
                Stock = c.Stock,
                Status = c.Status,
                IsFeatured = c.IsFeatured,
                CreatedAt = c.CreatedAt,
                Images = c.CarImages.OrderBy(img => img.DisplayOrder).Select(img => new CarImageDto
                {
                    Id = img.Id,
                    ImageUrl = img.ImageUrl,
                    IsPrimary = img.IsPrimary,
                    DisplayOrder = img.DisplayOrder
                }).ToList()
            }).ToList();

            return Ok(response);
        }

        // GET: api/Cars/5
        [HttpGet("{id}")]
        public async Task<ActionResult<CarResponseDto>> GetCar(int id)
        {
            var car = await _context.Cars
                .Include(c => c.CarImages)
                .FirstOrDefaultAsync(c => c.Id == id);

            if (car == null)
            {
                return NotFound(new { message = "Car not found" });
            }

            var response = new CarResponseDto
            {
                Id = car.Id,
                Brand = car.Brand,
                Model = car.Model,
                Year = car.Year,
                Price = car.Price,
                Color = car.Color,
                FuelType = car.FuelType,
                Transmission = car.Transmission,
                Mileage = car.Mileage,
                EngineCapacity = car.EngineCapacity,
                Seats = car.Seats,
                BodyType = car.BodyType,
                Description = car.Description,
                Features = car.Features,
                Stock = car.Stock,
                Status = car.Status,
                IsFeatured = car.IsFeatured,
                CreatedAt = car.CreatedAt,
                Images = car.CarImages.OrderBy(img => img.DisplayOrder).Select(img => new CarImageDto
                {
                    Id = img.Id,
                    ImageUrl = img.ImageUrl,
                    IsPrimary = img.IsPrimary,
                    DisplayOrder = img.DisplayOrder
                }).ToList()
            };

            return Ok(response);
        }

        // POST: api/Cars
        [HttpPost]
        [Authorize(Roles = "Admin")]
        public async Task<ActionResult<CarResponseDto>> CreateCar(CreateCarRequestDto request)
        {
            var car = new Car
            {
                Brand = request.Brand,
                Model = request.Model,
                Year = request.Year,
                Price = request.Price,
                Color = request.Color,
                FuelType = request.FuelType,
                Transmission = request.Transmission,
                Mileage = request.Mileage,
                EngineCapacity = request.EngineCapacity,
                Seats = request.Seats,
                BodyType = request.BodyType,
                Description = request.Description,
                Features = request.Features,
                Stock = request.Stock,
                IsFeatured = request.IsFeatured,
                Status = "Available",
                CreatedAt = DateTime.UtcNow
            };

            _context.Cars.Add(car);
            await _context.SaveChangesAsync();

            var response = new CarResponseDto
            {
                Id = car.Id,
                Brand = car.Brand,
                Model = car.Model,
                Year = car.Year,
                Price = car.Price,
                Color = car.Color,
                FuelType = car.FuelType,
                Transmission = car.Transmission,
                Mileage = car.Mileage,
                EngineCapacity = car.EngineCapacity,
                Seats = car.Seats,
                BodyType = car.BodyType,
                Description = car.Description,
                Features = car.Features,
                Stock = car.Stock,
                Status = car.Status,
                IsFeatured = car.IsFeatured,
                CreatedAt = car.CreatedAt,
                Images = new List<CarImageDto>()
            };

            return CreatedAtAction(nameof(GetCar), new { id = car.Id }, response);
        }

        // PUT: api/Cars/5
        [HttpPut("{id}")]
        [Authorize(Roles = "Admin")]
        public async Task<IActionResult> UpdateCar(int id, UpdateCarRequestDto request)
        {
            var car = await _context.Cars.FindAsync(id);

            if (car == null)
            {
                return NotFound(new { message = "Car not found" });
            }

            // Update only provided fields
            if (!string.IsNullOrEmpty(request.Brand))
                car.Brand = request.Brand;

            if (!string.IsNullOrEmpty(request.Model))
                car.Model = request.Model;

            if (request.Year.HasValue)
                car.Year = request.Year.Value;

            if (request.Price.HasValue)
                car.Price = request.Price.Value;

            if (request.Color != null)
                car.Color = request.Color;

            if (request.FuelType != null)
                car.FuelType = request.FuelType;

            if (request.Transmission != null)
                car.Transmission = request.Transmission;

            if (request.Mileage.HasValue)
                car.Mileage = request.Mileage;

            if (request.EngineCapacity != null)
                car.EngineCapacity = request.EngineCapacity;

            if (request.Seats.HasValue)
                car.Seats = request.Seats;

            if (request.BodyType != null)
                car.BodyType = request.BodyType;

            if (request.Description != null)
                car.Description = request.Description;

            if (request.Features != null)
                car.Features = request.Features;

            if (request.Stock.HasValue)
                car.Stock = request.Stock.Value;

            if (request.Status != null)
                car.Status = request.Status;

            if (request.IsFeatured.HasValue)
                car.IsFeatured = request.IsFeatured.Value;

            car.UpdatedAt = DateTime.UtcNow;

            await _context.SaveChangesAsync();

            return Ok(new { message = "Car updated successfully" });
        }

        // DELETE: api/Cars/5
        [HttpDelete("{id}")]
        [Authorize(Roles = "Admin")]
        public async Task<IActionResult> DeleteCar(int id)
        {
            var car = await _context.Cars.FindAsync(id);

            if (car == null)
            {
                return NotFound(new { message = "Car not found" });
            }

            _context.Cars.Remove(car);
            await _context.SaveChangesAsync();

            return Ok(new { message = "Car deleted successfully" });
        }
    }
}
