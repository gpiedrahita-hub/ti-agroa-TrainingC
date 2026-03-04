using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using AdminApi.Data;
using AdminApi.DTOs;
using AdminApi.Models;
using AdminApi.Utilidades;

namespace AdminApi.Controllers;

[ApiController]
[Route("api/[controller]")]
public class AuthController : ControllerBase
{
    private readonly AppDbContext _context;
    private readonly JwtUtils _jwtUtils;

    public AuthController(AppDbContext context, JwtUtils jwtUtils)
    {
        _context = context;
        _jwtUtils = jwtUtils;
    }

    [HttpPost("login")]
    public async Task<IActionResult> Login(LoginDto dto)
    {
        var user = await _context.Users
            .Include(u => u.Role)
            .ThenInclude(r => r.Permissions)
            .ThenInclude(rp => rp.Permission)
            .FirstOrDefaultAsync(u => u.UserName == dto.UserName);

        if (user == null || !BCrypt.Net.BCrypt.Verify(dto.Password, user.PasswordHash))
            return Unauthorized("Credenciales inválidas");

        if (!user.IsActive)
            return Unauthorized("Inactive User");

        var accessToken = _jwtUtils.GenerateAccessToken(user);

        return Ok(new { AccessToken = accessToken});
    }

    [HttpPost("register")]
    public async Task<IActionResult> Register(RegisterDto dto)
    {
        if (await _context.Users.AnyAsync(u => u.Email == dto.Email))
            return BadRequest("Email ya existe");

        var user = new User
        {
            UserName = dto.UserName,
            Email = dto.Email,
            PasswordHash = BCrypt.Net.BCrypt.HashPassword(dto.Password),
            FirstName = dto.FirstName,
            LastName = dto.LastName
        };

        _context.Users.Add(user);
        await _context.SaveChangesAsync();

        return Ok(new {Msg="Usuario creado"});
    }

}
