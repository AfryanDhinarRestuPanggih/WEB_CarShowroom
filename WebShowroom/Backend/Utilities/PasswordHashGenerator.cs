using BCrypt.Net;

namespace CarShowroomAPI.Utilities
{
    public class PasswordHashGenerator
    {
        public static void Main(string[] args)
        {
            Console.WriteLine("===========================================");
            Console.WriteLine("BCrypt Password Hash Generator");
            Console.WriteLine("===========================================");
            Console.WriteLine();

            if (args.Length > 0)
            {
                // Generate hash from command line argument
                string password = args[0];
                string hash = BCrypt.Net.BCrypt.HashPassword(password);
                Console.WriteLine($"Password: {password}");
                Console.WriteLine($"Hash: {hash}");
            }
            else
            {
                // Interactive mode
                Console.Write("Enter password to hash: ");
                string? password = Console.ReadLine();

                if (string.IsNullOrEmpty(password))
                {
                    Console.WriteLine("Error: Password cannot be empty!");
                    return;
                }

                string hash = BCrypt.Net.BCrypt.HashPassword(password);
                
                Console.WriteLine();
                Console.WriteLine("Generated Hash:");
                Console.WriteLine(hash);
                Console.WriteLine();
                Console.WriteLine("You can use this hash in your SQL INSERT statement.");
                Console.WriteLine();
                
                // Verify the hash
                Console.Write("Verify password (enter password again): ");
                string? verifyPassword = Console.ReadLine();
                
                if (!string.IsNullOrEmpty(verifyPassword))
                {
                    bool isValid = BCrypt.Net.BCrypt.Verify(verifyPassword, hash);
                    Console.WriteLine($"Verification: {(isValid ? "SUCCESS" : "FAILED")}");
                }
            }

            Console.WriteLine();
            Console.WriteLine("Press any key to exit...");
            Console.ReadKey();
        }
    }
}
