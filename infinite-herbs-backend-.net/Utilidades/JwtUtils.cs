using AdminApi.Models;
using Microsoft.IdentityModel.Tokens;
using System.IdentityModel.Tokens.Jwt;
using System.Security.Claims;
using System.Text;
using System.Text.Json;

namespace AdminApi.Utilidades;

public class JwtUtils
{
    private readonly IConfiguration _config;

    public JwtUtils(IConfiguration config) => _config = config;

    public string GenerateAccessToken(User user) {
        var roleData = new
        {
            id = user.Role.Id,
            name = user.Role.Name,
            permissions = user.Role.Permissions.Select(rp => new
            {
                id = rp.Permission.Id,
                name = rp.Permission.Key
            }).ToList()
        };
        var roleJson = JsonSerializer.Serialize(roleData);

        var claims = new List<Claim>
        {
            new("sub", user.Id),
            new("firstName", user.FirstName),
            new("lastName", user.LastName),
            new("role", roleJson, JsonClaimValueTypes.Json)
        };

        var key = new SymmetricSecurityKey(Encoding.UTF8.GetBytes(_config["Jwt:Key"]!));
        var creds = new SigningCredentials(key, SecurityAlgorithms.HmacSha256);

        var token = new JwtSecurityToken(
            issuer: _config["Jwt:Issuer"],
            audience: _config["Jwt:Audience"],
            claims: claims,
            expires: DateTime.UtcNow.AddMinutes(30),
            signingCredentials: creds
        );

        return new JwtSecurityTokenHandler().WriteToken(token);
    }
}