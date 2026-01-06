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
    public class InquiriesController : ControllerBase
    {
        private readonly ApplicationDbContext _context;

        public InquiriesController(ApplicationDbContext context)
        {
            _context = context;
        }

        // GET: api/Inquiries (User - get own inquiries)
        [HttpGet]
        [Authorize(Roles = "User")]
        public async Task<ActionResult<IEnumerable<InquiryResponseDto>>> GetUserInquiries()
        {
            var userId = int.Parse(User.FindFirst(ClaimTypes.NameIdentifier)?.Value ?? "0");

            var inquiries = await _context.Inquiries
                .Include(i => i.User)
                .Include(i => i.Car)
                .Where(i => i.UserId == userId)
                .OrderByDescending(i => i.CreatedAt)
                .ToListAsync();

            var response = inquiries.Select(i => new InquiryResponseDto
            {
                Id = i.Id,
                UserId = i.UserId,
                UserName = i.User.FullName,
                UserEmail = i.User.Email,
                CarId = i.CarId,
                CarBrand = i.Car.Brand,
                CarModel = i.Car.Model,
                Subject = i.Subject,
                Message = i.Message,
                Status = i.Status,
                AdminResponse = i.AdminResponse,
                CreatedAt = i.CreatedAt,
                UpdatedAt = i.UpdatedAt
            }).ToList();

            return Ok(response);
        }

        // GET: api/Inquiries/all (Admin - get all inquiries)
        [HttpGet("all")]
        [Authorize(Roles = "Admin")]
        public async Task<ActionResult<IEnumerable<InquiryResponseDto>>> GetAllInquiries(
            [FromQuery] string? status)
        {
            var query = _context.Inquiries
                .Include(i => i.User)
                .Include(i => i.Car)
                .AsQueryable();

            if (!string.IsNullOrEmpty(status))
            {
                query = query.Where(i => i.Status == status);
            }

            var inquiries = await query
                .OrderByDescending(i => i.CreatedAt)
                .ToListAsync();

            var response = inquiries.Select(i => new InquiryResponseDto
            {
                Id = i.Id,
                UserId = i.UserId,
                UserName = i.User.FullName,
                UserEmail = i.User.Email,
                CarId = i.CarId,
                CarBrand = i.Car.Brand,
                CarModel = i.Car.Model,
                Subject = i.Subject,
                Message = i.Message,
                Status = i.Status,
                AdminResponse = i.AdminResponse,
                CreatedAt = i.CreatedAt,
                UpdatedAt = i.UpdatedAt
            }).ToList();

            return Ok(response);
        }

        // GET: api/Inquiries/5
        [HttpGet("{id}")]
        [Authorize]
        public async Task<ActionResult<InquiryResponseDto>> GetInquiry(int id)
        {
            var inquiry = await _context.Inquiries
                .Include(i => i.User)
                .Include(i => i.Car)
                .FirstOrDefaultAsync(i => i.Id == id);

            if (inquiry == null)
            {
                return NotFound(new { message = "Inquiry not found" });
            }

            // Check authorization
            var userId = int.Parse(User.FindFirst(ClaimTypes.NameIdentifier)?.Value ?? "0");
            var userRole = User.FindFirst(ClaimTypes.Role)?.Value;

            if (userRole != "Admin" && inquiry.UserId != userId)
            {
                return Forbid();
            }

            var response = new InquiryResponseDto
            {
                Id = inquiry.Id,
                UserId = inquiry.UserId,
                UserName = inquiry.User.FullName,
                UserEmail = inquiry.User.Email,
                CarId = inquiry.CarId,
                CarBrand = inquiry.Car.Brand,
                CarModel = inquiry.Car.Model,
                Subject = inquiry.Subject,
                Message = inquiry.Message,
                Status = inquiry.Status,
                AdminResponse = inquiry.AdminResponse,
                CreatedAt = inquiry.CreatedAt,
                UpdatedAt = inquiry.UpdatedAt
            };

            return Ok(response);
        }

        // POST: api/Inquiries
        [HttpPost]
        [Authorize(Roles = "User")]
        public async Task<ActionResult<InquiryResponseDto>> CreateInquiry(CreateInquiryRequestDto request)
        {
            var userId = int.Parse(User.FindFirst(ClaimTypes.NameIdentifier)?.Value ?? "0");

            // Check if car exists
            var car = await _context.Cars.FindAsync(request.CarId);
            if (car == null)
            {
                return NotFound(new { message = "Car not found" });
            }

            var inquiry = new Inquiry
            {
                UserId = userId,
                CarId = request.CarId,
                Subject = request.Subject,
                Message = request.Message,
                Status = "Pending",
                CreatedAt = DateTime.UtcNow
            };

            _context.Inquiries.Add(inquiry);
            await _context.SaveChangesAsync();

            // Load navigation properties
            await _context.Entry(inquiry).Reference(i => i.User).LoadAsync();
            await _context.Entry(inquiry).Reference(i => i.Car).LoadAsync();

            var response = new InquiryResponseDto
            {
                Id = inquiry.Id,
                UserId = inquiry.UserId,
                UserName = inquiry.User.FullName,
                UserEmail = inquiry.User.Email,
                CarId = inquiry.CarId,
                CarBrand = inquiry.Car.Brand,
                CarModel = inquiry.Car.Model,
                Subject = inquiry.Subject,
                Message = inquiry.Message,
                Status = inquiry.Status,
                AdminResponse = inquiry.AdminResponse,
                CreatedAt = inquiry.CreatedAt,
                UpdatedAt = inquiry.UpdatedAt
            };

            return CreatedAtAction(nameof(GetInquiry), new { id = inquiry.Id }, response);
        }

        // PUT: api/Inquiries/5/response (Admin - respond to inquiry)
        [HttpPut("{id}/response")]
        [Authorize(Roles = "Admin")]
        public async Task<IActionResult> RespondToInquiry(int id, UpdateInquiryResponseDto request)
        {
            var inquiry = await _context.Inquiries.FindAsync(id);

            if (inquiry == null)
            {
                return NotFound(new { message = "Inquiry not found" });
            }

            var adminId = int.Parse(User.FindFirst(ClaimTypes.NameIdentifier)?.Value ?? "0");

            inquiry.AdminResponse = request.AdminResponse;
            inquiry.Status = request.Status;
            inquiry.RespondedBy = adminId;
            inquiry.UpdatedAt = DateTime.UtcNow;

            await _context.SaveChangesAsync();

            return Ok(new { message = "Inquiry response sent successfully" });
        }

        // DELETE: api/Inquiries/5 (Admin only)
        [HttpDelete("{id}")]
        [Authorize(Roles = "Admin")]
        public async Task<IActionResult> DeleteInquiry(int id)
        {
            var inquiry = await _context.Inquiries.FindAsync(id);

            if (inquiry == null)
            {
                return NotFound(new { message = "Inquiry not found" });
            }

            _context.Inquiries.Remove(inquiry);
            await _context.SaveChangesAsync();

            return Ok(new { message = "Inquiry deleted successfully" });
        }
    }
}
