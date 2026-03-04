using Microsoft.EntityFrameworkCore;
using AdminApi.Data;
using AdminApi.Models;

public class SeedService
{
    private readonly AppDbContext _context;
    private readonly ILogger<SeedService> _logger;

    public SeedService(AppDbContext context, ILogger<SeedService> logger)
    {
        _context = context;
        _logger = logger;
    }

    public async Task SeedAsync()
    {
        // 1. Crear permisos
        var permissions = new[]
        {
            new Permission { Key = "dashboard:read", Description = "Read Dashboard" },
            new Permission { Key = "users:read", Description = "Read users" },
            new Permission { Key = "users:create", Description = "Create users" },
            new Permission { Key = "users:update", Description = "Update users" },
            new Permission { Key = "users:delete", Description = "Delete users" }
        };

        await _context.Permissions.AddRangeAsync(permissions);
        await _context.SaveChangesAsync();

        // 2. Crear roles
        var adminRole = new Role 
        { 
            Name = "admin", 
            Description = "Administrator" 
        };
        var userRole = new Role 
        { 
            Name = "user", 
            Description = "Default user" 
        };
        var viewerRole = new Role 
        { 
            Name = "viewer", 
            Description = "Viewer" 
        };

        _context.Roles.AddRange(adminRole, userRole, viewerRole);
        await _context.SaveChangesAsync();

        var allPermissions = await _context.Permissions
            .Where(p => permissions.Select(x => x.Key).Contains(p.Key))
            .ToListAsync();

        foreach (var permission in allPermissions)
        {
            _context.RolePermissions.Add(new RolePermission 
            { 
                RoleId = adminRole.Id, 
                PermissionId = permission.Id 
            });
        }

        var dashboardRead = await _context.Permissions
            .FirstOrDefaultAsync(p => p.Key == "dashboard:read");
        
        if (dashboardRead != null)
        {
            _context.RolePermissions.Add(new RolePermission 
            { 
                RoleId = userRole.Id, 
                PermissionId = dashboardRead.Id 
            });
        }

        var readPermissions = await _context.Permissions
            .Where(p => new[] { "dashboard:read", "users:read" }.Contains(p.Key))
            .ToListAsync();

        foreach (var permission in readPermissions)
        {
            _context.RolePermissions.Add(new RolePermission 
            { 
                RoleId = viewerRole.Id, 
                PermissionId = permission.Id 
            });
        }

        await _context.SaveChangesAsync();

        var passwordPlain = "admin123";
        var hashedPassword = BCrypt.Net.BCrypt.HashPassword(passwordPlain, 12);

        var users = new[]
        {
            new User 
            { 
                Id = Guid.NewGuid().ToString(),
                UserName = "admin",
                Email = "admin@test.com",
                PasswordHash = hashedPassword,
                FirstName = "Admin",
                LastName = "Test",
                IsActive = true,
                RoleId = adminRole.Id
            },
            new User 
            { 
                Id = Guid.NewGuid().ToString(),
                UserName = "viewer",
                Email = "viewer@test.com",
                PasswordHash = hashedPassword,
                FirstName = "Viewer",
                LastName = "Test",
                IsActive = true,
                RoleId = viewerRole.Id
            },
            new User 
            { 
                Id = Guid.NewGuid().ToString(),
                UserName = "user",
                Email = "user@test.com",
                PasswordHash = hashedPassword,
                FirstName = "User",
                LastName = "Test",
                IsActive = true,
                RoleId = userRole.Id
            }
        };

        await _context.Users.AddRangeAsync(users);
        await _context.SaveChangesAsync();

        _logger.LogInformation("✅ Seed completado: {RolesCount} roles, {UsersCount} usuarios", 3, 3);
    }
}
