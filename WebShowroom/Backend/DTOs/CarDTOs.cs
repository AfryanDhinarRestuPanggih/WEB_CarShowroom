using System.ComponentModel.DataAnnotations;

namespace CarShowroomAPI.DTOs
{
    // Car Response DTO
    public class CarResponseDto
    {
        public int Id { get; set; }
        public string Brand { get; set; } = string.Empty;
        public string Model { get; set; } = string.Empty;
        public int Year { get; set; }
        public decimal Price { get; set; }
        public string? Color { get; set; }
        public string? FuelType { get; set; }
        public string? Transmission { get; set; }
        public int? Mileage { get; set; }
        public string? EngineCapacity { get; set; }
        public int? Seats { get; set; }
        public string? BodyType { get; set; }
        public string? Description { get; set; }
        public string? Features { get; set; }
        public int Stock { get; set; }
        public string Status { get; set; } = string.Empty;
        public bool IsFeatured { get; set; }
        public DateTime CreatedAt { get; set; }
        public List<CarImageDto> Images { get; set; } = new List<CarImageDto>();
    }

    // Car Image DTO
    public class CarImageDto
    {
        public int Id { get; set; }
        public string ImageUrl { get; set; } = string.Empty;
        public bool IsPrimary { get; set; }
        public int DisplayOrder { get; set; }
    }

    // Create Car Request DTO
    public class CreateCarRequestDto
    {
        [Required]
        [StringLength(100)]
        public string Brand { get; set; } = string.Empty;

        [Required]
        [StringLength(100)]
        public string Model { get; set; } = string.Empty;

        [Required]
        [Range(1900, 2100)]
        public int Year { get; set; }

        [Required]
        [Range(0, double.MaxValue)]
        public decimal Price { get; set; }

        [StringLength(50)]
        public string? Color { get; set; }

        [StringLength(50)]
        public string? FuelType { get; set; }

        [StringLength(50)]
        public string? Transmission { get; set; }

        public int? Mileage { get; set; }

        [StringLength(20)]
        public string? EngineCapacity { get; set; }

        public int? Seats { get; set; }

        [StringLength(50)]
        public string? BodyType { get; set; }

        public string? Description { get; set; }

        public string? Features { get; set; }

        [Range(0, int.MaxValue)]
        public int Stock { get; set; } = 1;

        public bool IsFeatured { get; set; } = false;
    }

    // Update Car Request DTO
    public class UpdateCarRequestDto
    {
        [StringLength(100)]
        public string? Brand { get; set; }

        [StringLength(100)]
        public string? Model { get; set; }

        [Range(1900, 2100)]
        public int? Year { get; set; }

        [Range(0, double.MaxValue)]
        public decimal? Price { get; set; }

        [StringLength(50)]
        public string? Color { get; set; }

        [StringLength(50)]
        public string? FuelType { get; set; }

        [StringLength(50)]
        public string? Transmission { get; set; }

        public int? Mileage { get; set; }

        [StringLength(20)]
        public string? EngineCapacity { get; set; }

        public int? Seats { get; set; }

        [StringLength(50)]
        public string? BodyType { get; set; }

        public string? Description { get; set; }

        public string? Features { get; set; }

        [Range(0, int.MaxValue)]
        public int? Stock { get; set; }

        [StringLength(50)]
        public string? Status { get; set; }

        public bool? IsFeatured { get; set; }
    }
}
