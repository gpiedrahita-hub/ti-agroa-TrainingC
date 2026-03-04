using System.ComponentModel.DataAnnotations;
namespace AdminApi.Models;
public class Permission {
    public int Id { get; set; }
    [Required] public string Key { get; set; } = "";
    public string Description { get; set; } = "";
    public ICollection<RolePermission> Roles { get; set; } = new List<RolePermission>();
    public DateTime CreatedAt { get; set; } = DateTime.UtcNow;
    public DateTime UpdatedAt { get; set; } = DateTime.UtcNow;
}
