namespace CarShowroomAPI.DTOs
{
    // Request DTOs
    public class CreateTransactionRequestDto
    {
        public int CarId { get; set; }
        public string PaymentMethod { get; set; } = string.Empty; // Cash, BankTransfer
    }

    public class UpdateTransactionStatusRequestDto
    {
        public string Status { get; set; } = string.Empty; // Completed, Rejected, Cancelled
        public string? AdminNotes { get; set; }
    }

    public class UploadPaymentProofRequestDto
    {
        public string PaymentProofUrl { get; set; } = string.Empty;
    }

    // Response DTOs
    public class TransactionResponseDto
    {
        public int Id { get; set; }
        public int UserId { get; set; }
        public string UserName { get; set; } = string.Empty;
        public string UserEmail { get; set; } = string.Empty;
        public int CarId { get; set; }
        public string CarBrand { get; set; } = string.Empty;
        public string CarModel { get; set; } = string.Empty;
        public int CarYear { get; set; }
        public decimal TotalPrice { get; set; }
        public string PaymentMethod { get; set; } = string.Empty;
        public string Status { get; set; } = string.Empty;
        public DateTime TransactionDate { get; set; }
        public DateTime CreatedAt { get; set; }
        public string? AdminNotes { get; set; }
        public PaymentResponseDto? Payment { get; set; }
    }

    public class PaymentResponseDto
    {
        public int Id { get; set; }
        public int TransactionId { get; set; }
        public string PaymentMethod { get; set; } = string.Empty;
        public decimal Amount { get; set; }
        public string? PaymentProofUrl { get; set; }
        public DateTime? PaymentDate { get; set; }
        public string Status { get; set; } = string.Empty;
        public string? AdminNotes { get; set; }
        public DateTime CreatedAt { get; set; }
    }
}
