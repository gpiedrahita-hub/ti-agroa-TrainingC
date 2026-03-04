namespace AdminApi.DTOs;

public class LoginDto
{
    public string UserName { get; set; } = string.Empty;
    public string Password { get; set; } = string.Empty;
}

public class RegisterDto : LoginDto
{
    public string FirstName { get; set; }  = "";
    public string LastName { get; set; }  = "";
    public string Email { get; set; }  = "";
}
