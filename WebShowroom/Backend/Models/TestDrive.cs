using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace CarShowroomAPI.Models
{
    public class TestDrive
    {
        [Key]
        public int Id { get; set; }

        [Required]
        public int UserId { get; set; }

        [Required]
        public int CarId { get; set; }

        [Required]
        public DateTime RequestedDate { get; set; }

        [Required]
        [StringLength(20)]
        public string RequestedTime { get; set; } = string.Empty; // e.g., "09:00", "14:00"

        [StringLength(50)]
        public string Status { get; set; } = "Pending"; // Pending, Approved, Rejected, Completed, Cancelled

        public string? Notes { get; set; }

        public string? AdminNotes { get; set; }

        public DateTime CreatedAt { get; set; } = DateTime.UtcNow;

        public DateTime? UpdatedAt { get; set; }

        public int? ApprovedBy { get; set; } // Admin ID

        // Navigation Properties
        [ForeignKey("UserId")]
        public virtual User User { get; set; } = null!;

        [ForeignKey("CarId")]
        public virtual Car Car { get; set; } = null!;
    }
}
