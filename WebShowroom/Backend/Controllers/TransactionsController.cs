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
    public class TransactionsController : ControllerBase
    {
        private readonly ApplicationDbContext _context;

        public TransactionsController(ApplicationDbContext context)
        {
            _context = context;
        }

        // POST: api/Transactions
        [HttpPost]
        [Authorize(Roles = "User")]
        public async Task<ActionResult<TransactionResponseDto>> CreateTransaction(CreateTransactionRequestDto request)
        {
            var userIdClaim = User.FindFirst(ClaimTypes.NameIdentifier)?.Value;
            if (string.IsNullOrEmpty(userIdClaim) || !int.TryParse(userIdClaim, out int userId))
            {
                return Unauthorized(new { message = "Invalid user" });
            }

            // Get car details
            var car = await _context.Cars.FindAsync(request.CarId);
            if (car == null)
            {
                return NotFound(new { message = "Car not found" });
            }

            // Check stock
            if (car.Stock <= 0)
            {
                return BadRequest(new { message = "Car is out of stock" });
            }

            // Validate payment method
            if (request.PaymentMethod != "Cash" && request.PaymentMethod != "BankTransfer")
            {
                return BadRequest(new { message = "Invalid payment method. Use 'Cash' or 'BankTransfer'" });
            }

            // Create transaction
            var transaction = new Transaction
            {
                UserId = userId,
                CarId = request.CarId,
                TotalPrice = car.Price,
                PaymentMethod = request.PaymentMethod,
                Status = request.PaymentMethod == "Cash" ? "Completed" : "Pending",
                TransactionDate = DateTime.UtcNow,
                CreatedAt = DateTime.UtcNow
            };

            _context.Transactions.Add(transaction);

            // Create payment record
            var payment = new Payment
            {
                Transaction = transaction,
                PaymentMethod = request.PaymentMethod,
                Amount = car.Price,
                Status = request.PaymentMethod == "Cash" ? "Verified" : "Pending",
                PaymentDate = request.PaymentMethod == "Cash" ? DateTime.UtcNow : null,
                CreatedAt = DateTime.UtcNow
            };

            _context.Payments.Add(payment);

            // If cash payment, reduce stock immediately
            if (request.PaymentMethod == "Cash")
            {
                car.Stock -= 1;
                if (car.Stock == 0)
                {
                    car.Status = "Sold";
                }
                car.UpdatedAt = DateTime.UtcNow;
            }

            await _context.SaveChangesAsync();

            // Get user details for response
            var user = await _context.Users.FindAsync(userId);

            var response = new TransactionResponseDto
            {
                Id = transaction.Id,
                UserId = transaction.UserId,
                UserName = user?.FullName ?? "",
                UserEmail = user?.Email ?? "",
                CarId = transaction.CarId,
                CarBrand = car.Brand,
                CarModel = car.Model,
                CarYear = car.Year,
                TotalPrice = transaction.TotalPrice,
                PaymentMethod = transaction.PaymentMethod,
                Status = transaction.Status,
                TransactionDate = transaction.TransactionDate,
                CreatedAt = transaction.CreatedAt,
                Payment = new PaymentResponseDto
                {
                    Id = payment.Id,
                    TransactionId = transaction.Id,
                    PaymentMethod = payment.PaymentMethod,
                    Amount = payment.Amount,
                    PaymentProofUrl = payment.PaymentProofUrl,
                    PaymentDate = payment.PaymentDate,
                    Status = payment.Status,
                    CreatedAt = payment.CreatedAt
                }
            };

            return CreatedAtAction(nameof(GetTransaction), new { id = transaction.Id }, response);
        }

        // GET: api/Transactions
        [HttpGet]
        [Authorize(Roles = "User")]
        public async Task<ActionResult<IEnumerable<TransactionResponseDto>>> GetUserTransactions()
        {
            var userIdClaim = User.FindFirst(ClaimTypes.NameIdentifier)?.Value;
            if (string.IsNullOrEmpty(userIdClaim) || !int.TryParse(userIdClaim, out int userId))
            {
                return Unauthorized(new { message = "Invalid user" });
            }

            var transactions = await _context.Transactions
                .Include(t => t.User)
                .Include(t => t.Car)
                .Include(t => t.Payment)
                .Where(t => t.UserId == userId)
                .OrderByDescending(t => t.CreatedAt)
                .ToListAsync();

            var response = transactions.Select(t => new TransactionResponseDto
            {
                Id = t.Id,
                UserId = t.UserId,
                UserName = t.User.FullName,
                UserEmail = t.User.Email,
                CarId = t.CarId,
                CarBrand = t.Car.Brand,
                CarModel = t.Car.Model,
                CarYear = t.Car.Year,
                TotalPrice = t.TotalPrice,
                PaymentMethod = t.PaymentMethod,
                Status = t.Status,
                TransactionDate = t.TransactionDate,
                CreatedAt = t.CreatedAt,
                AdminNotes = t.AdminNotes,
                Payment = t.Payment != null ? new PaymentResponseDto
                {
                    Id = t.Payment.Id,
                    TransactionId = t.Payment.TransactionId,
                    PaymentMethod = t.Payment.PaymentMethod,
                    Amount = t.Payment.Amount,
                    PaymentProofUrl = t.Payment.PaymentProofUrl,
                    PaymentDate = t.Payment.PaymentDate,
                    Status = t.Payment.Status,
                    AdminNotes = t.Payment.AdminNotes,
                    CreatedAt = t.Payment.CreatedAt
                } : null
            }).ToList();

            return Ok(response);
        }

        // GET: api/Transactions/all
        [HttpGet("all")]
        [Authorize(Roles = "Admin")]
        public async Task<ActionResult<IEnumerable<TransactionResponseDto>>> GetAllTransactions([FromQuery] string? status)
        {
            var query = _context.Transactions
                .Include(t => t.User)
                .Include(t => t.Car)
                .Include(t => t.Payment)
                .AsQueryable();

            if (!string.IsNullOrEmpty(status))
            {
                query = query.Where(t => t.Status == status);
            }

            var transactions = await query.OrderByDescending(t => t.CreatedAt).ToListAsync();

            var response = transactions.Select(t => new TransactionResponseDto
            {
                Id = t.Id,
                UserId = t.UserId,
                UserName = t.User.FullName,
                UserEmail = t.User.Email,
                CarId = t.CarId,
                CarBrand = t.Car.Brand,
                CarModel = t.Car.Model,
                CarYear = t.Car.Year,
                TotalPrice = t.TotalPrice,
                PaymentMethod = t.PaymentMethod,
                Status = t.Status,
                TransactionDate = t.TransactionDate,
                CreatedAt = t.CreatedAt,
                AdminNotes = t.AdminNotes,
                Payment = t.Payment != null ? new PaymentResponseDto
                {
                    Id = t.Payment.Id,
                    TransactionId = t.Payment.TransactionId,
                    PaymentMethod = t.Payment.PaymentMethod,
                    Amount = t.Payment.Amount,
                    PaymentProofUrl = t.Payment.PaymentProofUrl,
                    PaymentDate = t.Payment.PaymentDate,
                    Status = t.Payment.Status,
                    AdminNotes = t.Payment.AdminNotes,
                    CreatedAt = t.Payment.CreatedAt
                } : null
            }).ToList();

            return Ok(response);
        }

        // GET: api/Transactions/5
        [HttpGet("{id}")]
        [Authorize]
        public async Task<ActionResult<TransactionResponseDto>> GetTransaction(int id)
        {
            var transaction = await _context.Transactions
                .Include(t => t.User)
                .Include(t => t.Car)
                .Include(t => t.Payment)
                .FirstOrDefaultAsync(t => t.Id == id);

            if (transaction == null)
            {
                return NotFound(new { message = "Transaction not found" });
            }

            // Check if user is authorized to view this transaction
            var userIdClaim = User.FindFirst(ClaimTypes.NameIdentifier)?.Value;
            var userRole = User.FindFirst(ClaimTypes.Role)?.Value;
            
            if (userRole != "Admin" && transaction.UserId.ToString() != userIdClaim)
            {
                return Forbid();
            }

            var response = new TransactionResponseDto
            {
                Id = transaction.Id,
                UserId = transaction.UserId,
                UserName = transaction.User.FullName,
                UserEmail = transaction.User.Email,
                CarId = transaction.CarId,
                CarBrand = transaction.Car.Brand,
                CarModel = transaction.Car.Model,
                CarYear = transaction.Car.Year,
                TotalPrice = transaction.TotalPrice,
                PaymentMethod = transaction.PaymentMethod,
                Status = transaction.Status,
                TransactionDate = transaction.TransactionDate,
                CreatedAt = transaction.CreatedAt,
                AdminNotes = transaction.AdminNotes,
                Payment = transaction.Payment != null ? new PaymentResponseDto
                {
                    Id = transaction.Payment.Id,
                    TransactionId = transaction.Payment.TransactionId,
                    PaymentMethod = transaction.Payment.PaymentMethod,
                    Amount = transaction.Payment.Amount,
                    PaymentProofUrl = transaction.Payment.PaymentProofUrl,
                    PaymentDate = transaction.Payment.PaymentDate,
                    Status = transaction.Payment.Status,
                    AdminNotes = transaction.Payment.AdminNotes,
                    CreatedAt = transaction.Payment.CreatedAt
                } : null
            };

            return Ok(response);
        }

        // PUT: api/Transactions/5/status
        [HttpPut("{id}/status")]
        [Authorize(Roles = "Admin")]
        public async Task<IActionResult> UpdateTransactionStatus(int id, UpdateTransactionStatusRequestDto request)
        {
            var transaction = await _context.Transactions
                .Include(t => t.Car)
                .Include(t => t.Payment)
                .FirstOrDefaultAsync(t => t.Id == id);

            if (transaction == null)
            {
                return NotFound(new { message = "Transaction not found" });
            }

            // Validate status
            var validStatuses = new[] { "Completed", "Rejected", "Cancelled" };
            if (!validStatuses.Contains(request.Status))
            {
                return BadRequest(new { message = "Invalid status. Use 'Completed', 'Rejected', or 'Cancelled'" });
            }

            var oldStatus = transaction.Status;
            transaction.Status = request.Status;
            transaction.AdminNotes = request.AdminNotes;
            transaction.UpdatedAt = DateTime.UtcNow;

            // Update payment status
            if (transaction.Payment != null)
            {
                if (request.Status == "Completed")
                {
                    transaction.Payment.Status = "Verified";
                    transaction.Payment.PaymentDate = DateTime.UtcNow;
                    transaction.Payment.AdminNotes = request.AdminNotes;
                }
                else if (request.Status == "Rejected")
                {
                    transaction.Payment.Status = "Rejected";
                    transaction.Payment.AdminNotes = request.AdminNotes;
                }
                transaction.Payment.UpdatedAt = DateTime.UtcNow;
            }

            // Handle stock changes
            if (request.Status == "Completed" && oldStatus == "Pending")
            {
                // Reduce stock when approving a pending transaction
                if (transaction.Car.Stock > 0)
                {
                    transaction.Car.Stock -= 1;
                    if (transaction.Car.Stock == 0)
                    {
                        transaction.Car.Status = "Sold";
                    }
                    transaction.Car.UpdatedAt = DateTime.UtcNow;
                }
            }
            else if (request.Status == "Rejected" || request.Status == "Cancelled")
            {
                // Return stock if transaction was previously completed
                if (oldStatus == "Completed")
                {
                    transaction.Car.Stock += 1;
                    if (transaction.Car.Status == "Sold")
                    {
                        transaction.Car.Status = "Available";
                    }
                    transaction.Car.UpdatedAt = DateTime.UtcNow;
                }
            }

            await _context.SaveChangesAsync();

            return Ok(new { message = "Transaction status updated successfully" });
        }

        // POST: api/Transactions/5/payment-proof
        [HttpPost("{id}/payment-proof")]
        [Authorize(Roles = "User")]
        public async Task<IActionResult> UploadPaymentProof(int id, UploadPaymentProofRequestDto request)
        {
            var userIdClaim = User.FindFirst(ClaimTypes.NameIdentifier)?.Value;
            if (string.IsNullOrEmpty(userIdClaim) || !int.TryParse(userIdClaim, out int userId))
            {
                return Unauthorized(new { message = "Invalid user" });
            }

            var transaction = await _context.Transactions
                .Include(t => t.Payment)
                .FirstOrDefaultAsync(t => t.Id == id && t.UserId == userId);

            if (transaction == null)
            {
                return NotFound(new { message = "Transaction not found" });
            }

            if (transaction.Status != "Pending")
            {
                return BadRequest(new { message = "Can only upload payment proof for pending transactions" });
            }

            if (transaction.Payment == null)
            {
                return BadRequest(new { message = "Payment record not found" });
            }

            transaction.Payment.PaymentProofUrl = request.PaymentProofUrl;
            transaction.Payment.UpdatedAt = DateTime.UtcNow;

            await _context.SaveChangesAsync();

            return Ok(new { message = "Payment proof uploaded successfully" });
        }
    }
}
