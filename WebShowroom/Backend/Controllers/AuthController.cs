using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using CarShowroomAPI.Data;
using CarShowroomAPI.Models;
using CarShowroomAPI.DTOs;
using CarShowroomAPI.Services;
using BCrypt.Net;

namespace CarShowroomAPI.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class AuthController : ControllerBase
    {
        private readonly ApplicationDbContext _context;
        private readonly IJwtService _jwtService;

        public AuthController(ApplicationDbContext context, IJwtService jwtService)
        {
            _context = context;
            _jwtService = jwtService;
        }

        // POST: api/Auth/register
        [HttpPost("register")]
        public async Task<ActionResult<AuthResponseDto>> Register(RegisterRequestDto request)
        {
            // Check if email already exists
            if (await _context.Users.AnyAsync(u => u.Email == request.Email))
            {
                return BadRequest(new { message = "Email already exists" });
            }

            // Hash password
            var passwordHash = BCrypt.Net.BCrypt.HashPassword(request.Password);

            // Create new user
            var user = new User
            {
                FullName = request.FullName,
                Email = request.Email,
                PasswordHash = passwordHash,
                PhoneNumber = request.PhoneNumber,
                Address = request.Address,
                CreatedAt = DateTime.UtcNow,
                IsActive = true
            };

            _context.Users.Add(user);
            await _context.SaveChangesAsync();

            // Generate JWT token
            var token = _jwtService.GenerateToken(user.Id, user.Email, "User");

            var response = new AuthResponseDto
            {
                Id = user.Id,
                FullName = user.FullName,
                Email = user.Email,
                Token = token,
                Role = "User"
            };

            return Ok(response);
        }

        // POST: api/Auth/login
        [HttpPost("login")]
        public async Task<ActionResult<AuthResponseDto>> Login(LoginRequestDto request)
        {
            // Check user
            var user = await _context.Users.FirstOrDefaultAsync(u => u.Email == request.Email);

            if (user != null && BCrypt.Net.BCrypt.Verify(request.Password, user.PasswordHash))
            {
                if (!user.IsActive)
                {
                    return BadRequest(new { message = "Account is inactive" });
                }

                // Generate JWT token
                var token = _jwtService.GenerateToken(user.Id, user.Email, "User");

                var response = new AuthResponseDto
                {
                    Id = user.Id,
                    FullName = user.FullName,
                    Email = user.Email,
                    Token = token,
                    Role = "User"
                };

                return Ok(response);
            }

            return Unauthorized(new { message = "Invalid email or password" });
        }

        // POST: api/Auth/admin/login
        [HttpPost("admin/login")]
        public async Task<ActionResult<AuthResponseDto>> AdminLogin(LoginRequestDto request)
        {
            // Check admin
            var admin = await _context.Admins.FirstOrDefaultAsync(a => a.Email == request.Email);

            if (admin != null && BCrypt.Net.BCrypt.Verify(request.Password, admin.PasswordHash))
            {
                if (!admin.IsActive)
                {
                    return BadRequest(new { message = "Account is inactive" });
                }

                // Generate JWT token
                var token = _jwtService.GenerateToken(admin.Id, admin.Email, "Admin");

                var response = new AuthResponseDto
                {
                    Id = admin.Id,
                    FullName = admin.FullName,
                    Email = admin.Email,
                    Token = token,
                    Role = "Admin"
                };

                return Ok(response);
            }

            return Unauthorized(new { message = "Invalid email or password" });
        }
    }
}
