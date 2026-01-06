using Microsoft.EntityFrameworkCore;
using CarShowroomAPI.Models;

namespace CarShowroomAPI.Data
{
    public class ApplicationDbContext : DbContext
    {
        public ApplicationDbContext(DbContextOptions<ApplicationDbContext> options)
            : base(options)
        {
        }

        // DbSets
        public DbSet<User> Users { get; set; }
        public DbSet<Admin> Admins { get; set; }
        public DbSet<Car> Cars { get; set; }
        public DbSet<CarImage> CarImages { get; set; }
        public DbSet<TestDrive> TestDrives { get; set; }
        public DbSet<Inquiry> Inquiries { get; set; }
        public DbSet<Wishlist> Wishlists { get; set; }
        public DbSet<Transaction> Transactions { get; set; }
        public DbSet<Payment> Payments { get; set; }

        protected override void OnModelCreating(ModelBuilder modelBuilder)
        {
            base.OnModelCreating(modelBuilder);

            // User Configuration
            modelBuilder.Entity<User>(entity =>
            {
                entity.HasIndex(e => e.Email).IsUnique();
                entity.Property(e => e.CreatedAt).HasDefaultValueSql("GETUTCDATE()");
            });

            // Admin Configuration
            modelBuilder.Entity<Admin>(entity =>
            {
                entity.HasIndex(e => e.Email).IsUnique();
                entity.Property(e => e.CreatedAt).HasDefaultValueSql("GETUTCDATE()");
            });

            // Car Configuration
            modelBuilder.Entity<Car>(entity =>
            {
                entity.Property(e => e.Price).HasPrecision(18, 2);
                entity.Property(e => e.CreatedAt).HasDefaultValueSql("GETUTCDATE()");
            });

            // CarImage Configuration
            modelBuilder.Entity<CarImage>(entity =>
            {
                entity.HasOne(ci => ci.Car)
                    .WithMany(c => c.CarImages)
                    .HasForeignKey(ci => ci.CarId)
                    .OnDelete(DeleteBehavior.Cascade);
            });

            // TestDrive Configuration
            modelBuilder.Entity<TestDrive>(entity =>
            {
                entity.HasOne(td => td.User)
                    .WithMany(u => u.TestDrives)
                    .HasForeignKey(td => td.UserId)
                    .OnDelete(DeleteBehavior.Cascade);

                entity.HasOne(td => td.Car)
                    .WithMany(c => c.TestDrives)
                    .HasForeignKey(td => td.CarId)
                    .OnDelete(DeleteBehavior.Cascade);

                entity.Property(e => e.CreatedAt).HasDefaultValueSql("GETUTCDATE()");
            });

            // Inquiry Configuration
            modelBuilder.Entity<Inquiry>(entity =>
            {
                entity.HasOne(i => i.User)
                    .WithMany(u => u.Inquiries)
                    .HasForeignKey(i => i.UserId)
                    .OnDelete(DeleteBehavior.Cascade);

                entity.HasOne(i => i.Car)
                    .WithMany(c => c.Inquiries)
                    .HasForeignKey(i => i.CarId)
                    .OnDelete(DeleteBehavior.Cascade);

                entity.Property(e => e.CreatedAt).HasDefaultValueSql("GETUTCDATE()");
            });

            // Wishlist Configuration
            modelBuilder.Entity<Wishlist>(entity =>
            {
                entity.HasOne(w => w.User)
                    .WithMany(u => u.Wishlists)
                    .HasForeignKey(w => w.UserId)
                    .OnDelete(DeleteBehavior.Cascade);

                entity.HasOne(w => w.Car)
                    .WithMany(c => c.Wishlists)
                    .HasForeignKey(w => w.CarId)
                    .OnDelete(DeleteBehavior.Cascade);

                // Prevent duplicate wishlist entries
                entity.HasIndex(w => new { w.UserId, w.CarId }).IsUnique();
                entity.Property(e => e.CreatedAt).HasDefaultValueSql("GETUTCDATE()");
            });

            // Transaction Configuration
            modelBuilder.Entity<Transaction>(entity =>
            {
                entity.HasOne(t => t.User)
                    .WithMany(u => u.Transactions)
                    .HasForeignKey(t => t.UserId)
                    .OnDelete(DeleteBehavior.Cascade);

                entity.HasOne(t => t.Car)
                    .WithMany(c => c.Transactions)
                    .HasForeignKey(t => t.CarId)
                    .OnDelete(DeleteBehavior.Cascade);

                entity.Property(e => e.TotalPrice).HasPrecision(18, 2);
                entity.Property(e => e.CreatedAt).HasDefaultValueSql("GETUTCDATE()");
            });

            // Payment Configuration
            modelBuilder.Entity<Payment>(entity =>
            {
                entity.HasOne(p => p.Transaction)
                    .WithOne(t => t.Payment)
                    .HasForeignKey<Payment>(p => p.TransactionId)
                    .OnDelete(DeleteBehavior.Cascade);

                entity.Property(e => e.Amount).HasPrecision(18, 2);
                entity.Property(e => e.CreatedAt).HasDefaultValueSql("GETUTCDATE()");
            });
        }
    }
}
