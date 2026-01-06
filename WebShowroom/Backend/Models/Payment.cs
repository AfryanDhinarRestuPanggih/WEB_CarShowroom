using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace CarShowroomAPI.Models
{
    public class Payment
    {
        [Key]
        public int Id { get; set; }

        [Required]
        public int TransactionId { get; set; }

        [Required]
        [StringLength(50)]
        public string PaymentMethod { get; set; } = string.Empty; // Cash, BankTransfer

        [Required]
        [Column(TypeName = "decimal(18,2)")]
        public decimal Amount { get; set; }

        public string? PaymentProofUrl { get; set; } // URL to uploaded payment proof image

        public DateTime? PaymentDate { get; set; }

        [Required]
        [StringLength(50)]
        public string Status { get; set; } = "Pending"; // Pending, Verified, Rejected

        public string? AdminNotes { get; set; }

        public DateTime CreatedAt { get; set; } = DateTime.UtcNow;

        public DateTime? UpdatedAt { get; set; }

        // Navigation Properties
        public virtual Transaction Transaction { get; set; } = null!;
    }
}
