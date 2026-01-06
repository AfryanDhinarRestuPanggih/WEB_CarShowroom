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
    public class TestDrivesController : ControllerBase
    {
        private readonly ApplicationDbContext _context;

        public TestDrivesController(ApplicationDbContext context)
        {
            _context = context;
        }

        // GET: api/TestDrives (User - get own test drives)
        [HttpGet]
        [Authorize(Roles = "User")]
        public async Task<ActionResult<IEnumerable<TestDriveResponseDto>>> GetUserTestDrives()
        {
            var userId = int.Parse(User.FindFirst(ClaimTypes.NameIdentifier)?.Value ?? "0");

            var testDrives = await _context.TestDrives
                .Include(td => td.User)
                .Include(td => td.Car)
                .Where(td => td.UserId == userId)
                .OrderByDescending(td => td.CreatedAt)
                .ToListAsync();

            var response = testDrives.Select(td => new TestDriveResponseDto
            {
                Id = td.Id,
                UserId = td.UserId,
                UserName = td.User.FullName,
                UserEmail = td.User.Email,
                UserPhone = td.User.PhoneNumber,
                CarId = td.CarId,
                CarBrand = td.Car.Brand,
                CarModel = td.Car.Model,
                RequestedDate = td.RequestedDate,
                RequestedTime = td.RequestedTime,
                Status = td.Status,
                Notes = td.Notes,
                AdminNotes = td.AdminNotes,
                CreatedAt = td.CreatedAt
            }).ToList();

            return Ok(response);
        }

        // GET: api/TestDrives/all (Admin - get all test drives)
        [HttpGet("all")]
        [Authorize(Roles = "Admin")]
        public async Task<ActionResult<IEnumerable<TestDriveResponseDto>>> GetAllTestDrives(
            [FromQuery] string? status)
        {
            var query = _context.TestDrives
                .Include(td => td.User)
                .Include(td => td.Car)
                .AsQueryable();

            if (!string.IsNullOrEmpty(status))
            {
                query = query.Where(td => td.Status == status);
            }

            var testDrives = await query
                .OrderByDescending(td => td.CreatedAt)
                .ToListAsync();

            var response = testDrives.Select(td => new TestDriveResponseDto
            {
                Id = td.Id,
                UserId = td.UserId,
                UserName = td.User.FullName,
                UserEmail = td.User.Email,
                UserPhone = td.User.PhoneNumber,
                CarId = td.CarId,
                CarBrand = td.Car.Brand,
                CarModel = td.Car.Model,
                RequestedDate = td.RequestedDate,
                RequestedTime = td.RequestedTime,
                Status = td.Status,
                Notes = td.Notes,
                AdminNotes = td.AdminNotes,
                CreatedAt = td.CreatedAt
            }).ToList();

            return Ok(response);
        }

        // GET: api/TestDrives/5
        [HttpGet("{id}")]
        [Authorize]
        public async Task<ActionResult<TestDriveResponseDto>> GetTestDrive(int id)
        {
            var testDrive = await _context.TestDrives
                .Include(td => td.User)
                .Include(td => td.Car)
                .FirstOrDefaultAsync(td => td.Id == id);

            if (testDrive == null)
            {
                return NotFound(new { message = "Test drive not found" });
            }

            // Check authorization
            var userId = int.Parse(User.FindFirst(ClaimTypes.NameIdentifier)?.Value ?? "0");
            var userRole = User.FindFirst(ClaimTypes.Role)?.Value;

            if (userRole != "Admin" && testDrive.UserId != userId)
            {
                return Forbid();
            }

            var response = new TestDriveResponseDto
            {
                Id = testDrive.Id,
                UserId = testDrive.UserId,
                UserName = testDrive.User.FullName,
                UserEmail = testDrive.User.Email,
                UserPhone = testDrive.User.PhoneNumber,
                CarId = testDrive.CarId,
                CarBrand = testDrive.Car.Brand,
                CarModel = testDrive.Car.Model,
                RequestedDate = testDrive.RequestedDate,
                RequestedTime = testDrive.RequestedTime,
                Status = testDrive.Status,
                Notes = testDrive.Notes,
                AdminNotes = testDrive.AdminNotes,
                CreatedAt = testDrive.CreatedAt
            };

            return Ok(response);
        }

        // POST: api/TestDrives
        [HttpPost]
        [Authorize(Roles = "User")]
        public async Task<ActionResult<TestDriveResponseDto>> CreateTestDrive(CreateTestDriveRequestDto request)
        {
            var userId = int.Parse(User.FindFirst(ClaimTypes.NameIdentifier)?.Value ?? "0");

            // Check if car exists
            var car = await _context.Cars.FindAsync(request.CarId);
            if (car == null)
            {
                return NotFound(new { message = "Car not found" });
            }

            var testDrive = new TestDrive
            {
                UserId = userId,
                CarId = request.CarId,
                RequestedDate = request.RequestedDate,
                RequestedTime = request.RequestedTime,
                Notes = request.Notes,
                Status = "Pending",
                CreatedAt = DateTime.UtcNow
            };

            _context.TestDrives.Add(testDrive);
            await _context.SaveChangesAsync();

            // Load navigation properties
            await _context.Entry(testDrive).Reference(td => td.User).LoadAsync();
            await _context.Entry(testDrive).Reference(td => td.Car).LoadAsync();

            var response = new TestDriveResponseDto
            {
                Id = testDrive.Id,
                UserId = testDrive.UserId,
                UserName = testDrive.User.FullName,
                UserEmail = testDrive.User.Email,
                UserPhone = testDrive.User.PhoneNumber,
                CarId = testDrive.CarId,
                CarBrand = testDrive.Car.Brand,
                CarModel = testDrive.Car.Model,
                RequestedDate = testDrive.RequestedDate,
                RequestedTime = testDrive.RequestedTime,
                Status = testDrive.Status,
                Notes = testDrive.Notes,
                AdminNotes = testDrive.AdminNotes,
                CreatedAt = testDrive.CreatedAt
            };

            return CreatedAtAction(nameof(GetTestDrive), new { id = testDrive.Id }, response);
        }

        // PUT: api/TestDrives/5/status (Admin - update status)
        [HttpPut("{id}/status")]
        [Authorize(Roles = "Admin")]
        public async Task<IActionResult> UpdateTestDriveStatus(int id, UpdateTestDriveStatusDto request)
        {
            var testDrive = await _context.TestDrives.FindAsync(id);

            if (testDrive == null)
            {
                return NotFound(new { message = "Test drive not found" });
            }

            var adminId = int.Parse(User.FindFirst(ClaimTypes.NameIdentifier)?.Value ?? "0");

            testDrive.Status = request.Status;
            testDrive.AdminNotes = request.AdminNotes;
            testDrive.ApprovedBy = adminId;
            testDrive.UpdatedAt = DateTime.UtcNow;

            await _context.SaveChangesAsync();

            return Ok(new { message = "Test drive status updated successfully" });
        }

        // DELETE: api/TestDrives/5 (User - cancel own test drive)
        [HttpDelete("{id}")]
        [Authorize(Roles = "User")]
        public async Task<IActionResult> CancelTestDrive(int id)
        {
            var userId = int.Parse(User.FindFirst(ClaimTypes.NameIdentifier)?.Value ?? "0");
            var testDrive = await _context.TestDrives.FindAsync(id);

            if (testDrive == null)
            {
                return NotFound(new { message = "Test drive not found" });
            }

            if (testDrive.UserId != userId)
            {
                return Forbid();
            }

            if (testDrive.Status == "Completed")
            {
                return BadRequest(new { message = "Cannot cancel completed test drive" });
            }

            testDrive.Status = "Cancelled";
            testDrive.UpdatedAt = DateTime.UtcNow;

            await _context.SaveChangesAsync();

            return Ok(new { message = "Test drive cancelled successfully" });
        }
    }
}
