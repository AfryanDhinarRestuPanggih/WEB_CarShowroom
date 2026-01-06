using System.ComponentModel.DataAnnotations;

namespace CarShowroomAPI.DTOs
{
    // Test Drive Request DTO
    public class CreateTestDriveRequestDto
    {
        [Required]
        public int CarId { get; set; }

        [Required]
        public DateTime RequestedDate { get; set; }

        [Required]
        [StringLength(20)]
        public string RequestedTime { get; set; } = string.Empty;

        public string? Notes { get; set; }
    }

    // Test Drive Response DTO
    public class TestDriveResponseDto
    {
        public int Id { get; set; }
        public int UserId { get; set; }
        public string UserName { get; set; } = string.Empty;
        public string UserEmail { get; set; } = string.Empty;
        public string? UserPhone { get; set; }
        public int CarId { get; set; }
        public string CarBrand { get; set; } = string.Empty;
        public string CarModel { get; set; } = string.Empty;
        public DateTime RequestedDate { get; set; }
        public string RequestedTime { get; set; } = string.Empty;
        public string Status { get; set; } = string.Empty;
        public string? Notes { get; set; }
        public string? AdminNotes { get; set; }
        public DateTime CreatedAt { get; set; }
    }

    // Update Test Drive Status DTO
    public class UpdateTestDriveStatusDto
    {
        [Required]
        [StringLength(50)]
        public string Status { get; set; } = string.Empty; // Approved, Rejected, Completed, Cancelled

        public string? AdminNotes { get; set; }
    }

    // Inquiry Request DTO
    public class CreateInquiryRequestDto
    {
        [Required]
        public int CarId { get; set; }

        [Required]
        [StringLength(200)]
        public string Subject { get; set; } = string.Empty;

        [Required]
        public string Message { get; set; } = string.Empty;
    }

    // Inquiry Response DTO
    public class InquiryResponseDto
    {
        public int Id { get; set; }
        public int UserId { get; set; }
        public string UserName { get; set; } = string.Empty;
        public string UserEmail { get; set; } = string.Empty;
        public int CarId { get; set; }
        public string CarBrand { get; set; } = string.Empty;
        public string CarModel { get; set; } = string.Empty;
        public string Subject { get; set; } = string.Empty;
        public string Message { get; set; } = string.Empty;
        public string Status { get; set; } = string.Empty;
        public string? AdminResponse { get; set; }
        public DateTime CreatedAt { get; set; }
        public DateTime? UpdatedAt { get; set; }
    }

    // Update Inquiry Response DTO
    public class UpdateInquiryResponseDto
    {
        [Required]
        public string AdminResponse { get; set; } = string.Empty;

        [Required]
        [StringLength(50)]
        public string Status { get; set; } = string.Empty; // Responded, Resolved, Closed
    }
}
