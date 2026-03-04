using System.ComponentModel.DataAnnotations;
namespace AdminApi.Models;
public class User {
    [Key]
    public string Id { get; set; } = Guid.NewGuid().ToString();
    [Required] public string UserName { get; set; } = "";
    [Required] public string Email { get; set; } = "";
    public string PasswordHash { get; set; } = "";
    public string FirstName { get; set; }  = "";
    public string LastName { get; set; }  = "";
    public int RoleId { get; set; }
    public Role Role { get; set; } = null!;
    public Boolean IsActive { get; set; }  = false;
    public DateTime CreatedAt { get; set; } = DateTime.UtcNow;
    public DateTime UpdatedAt { get; set; } = DateTime.UtcNow;
}
