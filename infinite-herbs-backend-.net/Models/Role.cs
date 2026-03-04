using System.ComponentModel.DataAnnotations;
namespace AdminApi.Models;
public class Role {
    public int Id { get; set; }
    [Required] public string Name { get; set; } = "";
    public string Description { get; set; } = "";
    public ICollection<RolePermission> Permissions { get; set; } = new List<RolePermission>();
    public ICollection<User> Users { get; set; } = new List<User>();
    public DateTime CreatedAt { get; set; } = DateTime.UtcNow;
    public DateTime UpdatedAt { get; set; } = DateTime.UtcNow;
}