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
    [Authorize(Roles = "User")]
    public class WishlistController : ControllerBase
    {
        private readonly ApplicationDbContext _context;

        public WishlistController(ApplicationDbContext context)
        {
            _context = context;
        }

        // GET: api/Wishlist
        [HttpGet]
        public async Task<ActionResult<IEnumerable<CarResponseDto>>> GetWishlist()
        {
            var userId = int.Parse(User.FindFirst(ClaimTypes.NameIdentifier)?.Value ?? "0");

            var wishlistItems = await _context.Wishlists
                .Include(w => w.Car)
                    .ThenInclude(c => c.CarImages)
                .Where(w => w.UserId == userId)
                .OrderByDescending(w => w.CreatedAt)
                .ToListAsync();

            var response = wishlistItems.Select(w => new CarResponseDto
            {
                Id = w.Car.Id,
                Brand = w.Car.Brand,
                Model = w.Car.Model,
                Year = w.Car.Year,
                Price = w.Car.Price,
                Color = w.Car.Color,
                FuelType = w.Car.FuelType,
                Transmission = w.Car.Transmission,
                Mileage = w.Car.Mileage,
                EngineCapacity = w.Car.EngineCapacity,
                Seats = w.Car.Seats,
                BodyType = w.Car.BodyType,
                Description = w.Car.Description,
                Features = w.Car.Features,
                Stock = w.Car.Stock,
                Status = w.Car.Status,
                IsFeatured = w.Car.IsFeatured,
                CreatedAt = w.Car.CreatedAt,
                Images = w.Car.CarImages.OrderBy(img => img.DisplayOrder).Select(img => new CarImageDto
                {
                    Id = img.Id,
                    ImageUrl = img.ImageUrl,
                    IsPrimary = img.IsPrimary,
                    DisplayOrder = img.DisplayOrder
                }).ToList()
            }).ToList();

            return Ok(response);
        }

        // POST: api/Wishlist/5
        [HttpPost("{carId}")]
        public async Task<IActionResult> AddToWishlist(int carId)
        {
            var userId = int.Parse(User.FindFirst(ClaimTypes.NameIdentifier)?.Value ?? "0");

            // Check if car exists
            var car = await _context.Cars.FindAsync(carId);
            if (car == null)
            {
                return NotFound(new { message = "Car not found" });
            }

            // Check if already in wishlist
            var existingWishlist = await _context.Wishlists
                .FirstOrDefaultAsync(w => w.UserId == userId && w.CarId == carId);

            if (existingWishlist != null)
            {
                return BadRequest(new { message = "Car already in wishlist" });
            }

            var wishlist = new Wishlist
            {
                UserId = userId,
                CarId = carId,
                CreatedAt = DateTime.UtcNow
            };

            _context.Wishlists.Add(wishlist);
            await _context.SaveChangesAsync();

            return Ok(new { message = "Car added to wishlist successfully" });
        }

        // DELETE: api/Wishlist/5
        [HttpDelete("{carId}")]
        public async Task<IActionResult> RemoveFromWishlist(int carId)
        {
            var userId = int.Parse(User.FindFirst(ClaimTypes.NameIdentifier)?.Value ?? "0");

            var wishlist = await _context.Wishlists
                .FirstOrDefaultAsync(w => w.UserId == userId && w.CarId == carId);

            if (wishlist == null)
            {
                return NotFound(new { message = "Car not found in wishlist" });
            }

            _context.Wishlists.Remove(wishlist);
            await _context.SaveChangesAsync();

            return Ok(new { message = "Car removed from wishlist successfully" });
        }

        // GET: api/Wishlist/check/5
        [HttpGet("check/{carId}")]
        public async Task<ActionResult<bool>> CheckWishlist(int carId)
        {
            var userId = int.Parse(User.FindFirst(ClaimTypes.NameIdentifier)?.Value ?? "0");

            var exists = await _context.Wishlists
                .AnyAsync(w => w.UserId == userId && w.CarId == carId);

            return Ok(new { inWishlist = exists });
        }
    }
}
