using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using AdminApi.Data;
using AdminApi.Models;
using AdminApi.DTOs;

[ApiController]
[Route("api/[controller]")]
public class UsersController : ControllerBase
{
    private readonly AppDbContext _context;

    public UsersController(AppDbContext context) => _context = context;

    [HttpGet]
    [Authorize(Policy = "AdminOrViewer")]
    public async Task<ActionResult<List<UserDto>>> GetAll()
    {
        var users = await _context.Users
            .Include(u => u.Role)
                .ThenInclude(r => r.Permissions)
                .ThenInclude(rp => rp.Permission)
            .Select(u => new UserDto
            {
                UserName = u.UserName,
                Email = u.Email,
                FirstName = u.FirstName,
                LastName = u.LastName,
                Role = new RoleDto
                {
                    Id = u.Role.Id,
                    Name = u.Role.Name,
                    Permissions = u.Role.Permissions.Select(rp => new PermissionDto
                    {
                        Id = rp.Permission.Id,
                        Name = rp.Permission.Key
                    }).ToList()
                },
                IsActive = u.IsActive,
            })
            .ToListAsync();

        return Ok(users);
    }

    [HttpGet("{id}")]
    [Authorize(Policy = "AdminOrViewer")]
    public async Task<ActionResult<UserDto>> Get(string id)
    {
        var user = await _context.Users
            .Include(u => u.Role)
                .ThenInclude(r => r.Permissions)
                .ThenInclude(rp => rp.Permission)
            .FirstOrDefaultAsync(u => u.Id == id);

        if (user == null) return NotFound();

        var userDto = this.MapToUserResponse(user);

        return Ok(userDto);
    }

    [HttpPost]
    [Authorize(Policy = "AdminOnly")]
    public async Task<ActionResult<UserDto>> Create(RequestUserDto dto)
    {
        int roleId = await _GerRoleId(dto);
        var user = new User
        {
            Id = Guid.NewGuid().ToString(),
            UserName = dto.UserName,
            Email = dto.Email,
            PasswordHash = BCrypt.Net.BCrypt.HashPassword(dto.Password),
            FirstName = dto.FirstName,
            LastName = dto.LastName,
            RoleId = roleId,
            IsActive = dto.IsActive,
            CreatedAt = DateTime.UtcNow,
            UpdatedAt = DateTime.UtcNow
        };

        _context.Users.Add(user);
        await _context.SaveChangesAsync();

        await _context.Entry(user).Reference(u => u.Role).LoadAsync();
        await _context.Entry(user.Role).Collection(r => r.Permissions).LoadAsync();
        foreach (var rp in user.Role.Permissions)
            await _context.Entry(rp).Reference(p => p.Permission).LoadAsync();

        var response = MapToUserResponse(user);
        return CreatedAtAction(nameof(Get), new { id = user.Id }, response);
    }

    private async Task<int> _GerRoleId(RequestUserDto dto)
    {
        var role = await _context.Roles
                    .FirstOrDefaultAsync(u => u.Name == dto.Role);
        var roleId = 1;
        if (role != null)
        {
            roleId = role.Id;
        }

        return roleId;
    }

    [HttpPut("{id}")]
    [Authorize(Policy = "AdminOnly")]
    public async Task<IActionResult> Update(string id, RequestUserDto dto)
    {
        var existing = await _context.Users.FindAsync(id);
        if (existing == null) return NotFound();

        int roleId = await _GerRoleId(dto);

        existing.UserName = dto.UserName;
        existing.Email = dto.Email;
        existing.FirstName = dto.FirstName;
        existing.LastName = dto.LastName;
        existing.RoleId = roleId;
        existing.IsActive = dto.IsActive;
        if (!string.IsNullOrWhiteSpace(dto.Password))
            existing.PasswordHash = BCrypt.Net.BCrypt.HashPassword(dto.Password);

        existing.UpdatedAt = DateTime.UtcNow;
        await _context.SaveChangesAsync();
        return NoContent();
    }

    [HttpDelete("{id}")]
    [Authorize(Policy = "AdminOnly")]
    public async Task<IActionResult> Delete(string id)
    {
        var user = await _context.Users.FindAsync(id);
        if (user == null) return NotFound();
        _context.Users.Remove(user);
        await _context.SaveChangesAsync();
        return NoContent();
    }

    private UserDto MapToUserResponse(User user)
    {
        return new UserDto
        {
            UserName = user.UserName,
            Email = user.Email,
            FirstName = user.FirstName,
            LastName = user.LastName,
            Role = new RoleDto
            {
                Id = user.Role.Id,
                Name = user.Role.Name,
                Permissions = user.Role.Permissions.Select(rp => new PermissionDto
                {
                    Id = rp.Permission.Id,
                    Name = rp.Permission.Key
                }).ToList()
            },
            IsActive = user.IsActive,
        };
    }
}
