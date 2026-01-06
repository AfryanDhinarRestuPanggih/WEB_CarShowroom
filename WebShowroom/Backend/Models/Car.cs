using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace CarShowroomAPI.Models
{
    public class Car
    {
        [Key]
        public int Id { get; set; }

        [Required]
        [StringLength(100)]
        public string Brand { get; set; } = string.Empty;

        [Required]
        [StringLength(100)]
        public string Model { get; set; } = string.Empty;

        [Required]
        public int Year { get; set; }

        [Required]
        [Column(TypeName = "decimal(18,2)")]
        public decimal Price { get; set; }

        [StringLength(50)]
        public string? Color { get; set; }

        [StringLength(50)]
        public string? FuelType { get; set; } // Bensin, Diesel, Hybrid, Electric

        [StringLength(50)]
        public string? Transmission { get; set; } // Manual, Automatic, CVT

        public int? Mileage { get; set; } // Kilometer

        [StringLength(20)]
        public string? EngineCapacity { get; set; } // e.g., "1500cc", "2000cc"

        public int? Seats { get; set; }

        [StringLength(50)]
        public string? BodyType { get; set; } // Sedan, SUV, Hatchback, MPV, etc.

        public string? Description { get; set; }

        public string? Features { get; set; } // JSON string or comma-separated

        public int Stock { get; set; } = 1;

        [StringLength(50)]
        public string Status { get; set; } = "Available"; // Available, Sold, Reserved

        public bool IsFeatured { get; set; } = false;

        public DateTime CreatedAt { get; set; } = DateTime.UtcNow;

        public DateTime? UpdatedAt { get; set; }

        // Navigation Properties
        public virtual ICollection<CarImage> CarImages { get; set; } = new List<CarImage>();
        public virtual ICollection<TestDrive> TestDrives { get; set; } = new List<TestDrive>();
        public virtual ICollection<Inquiry> Inquiries { get; set; } = new List<Inquiry>();
        public virtual ICollection<Wishlist> Wishlists { get; set; } = new List<Wishlist>();
        public virtual ICollection<Transaction> Transactions { get; set; } = new List<Transaction>();
    }
}
