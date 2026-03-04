namespace AdminApi.DTOs;

public class UserDto
{
    public string UserName { get; set; } = string.Empty;
    public string Email { get; set; } = string.Empty;
    public string Password { get; set; } = string.Empty;
    public string FirstName { get; set; } = string.Empty;
    public string LastName { get; set; } = string.Empty;
    public RoleDto Role { get; set; } = null!;
    public Boolean IsActive { get; set; } = false;
}

public class RequestUserDto {
    public string UserName { get; set; } = string.Empty;
    public string Email { get; set; } = string.Empty;
    public string Password { get; set; } = string.Empty;
    public string FirstName { get; set; } = string.Empty;
    public string LastName { get; set; } = string.Empty;
    public string  Role { get; set; } = null!;
    public Boolean IsActive { get; set; } = false;
}
