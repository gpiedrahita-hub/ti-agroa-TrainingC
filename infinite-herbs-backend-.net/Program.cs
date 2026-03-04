using AdminApi.Data;
using AdminApi.Utilidades;
using Microsoft.AspNetCore.Authentication.JwtBearer;
using Microsoft.EntityFrameworkCore;
using Microsoft.IdentityModel.Tokens;
using System.IdentityModel.Tokens.Jwt;
using System.Security.Claims;
using System.Text;
using System.Text.Json;

var builder = WebApplication.CreateBuilder(args);

builder.Services.AddControllers();

builder.Services.AddDbContext<AppDbContext>(options =>
    options.UseSqlServer(builder.Configuration.GetConnectionString("DefaultConnection")));

builder.Services.AddScoped<JwtUtils>();

builder.Services.AddAuthentication(JwtBearerDefaults.AuthenticationScheme)
    .AddJwtBearer(options =>
    {
        options.TokenValidationParameters = new TokenValidationParameters
        {
            ValidateIssuer = true,
            ValidateAudience = true,
            ValidateLifetime = true,
            ValidateIssuerSigningKey = true,
            ValidIssuer = builder.Configuration["Jwt:Issuer"],
            ValidAudience = builder.Configuration["Jwt:Audience"],
            IssuerSigningKey = new SymmetricSecurityKey(
                Encoding.UTF8.GetBytes(builder.Configuration["Jwt:Key"]!)),
            NameClaimType = "sub",
            RoleClaimType = "role"
        };

        JwtSecurityTokenHandler.DefaultMapInboundClaims = false;

        options.Events = new JwtBearerEvents
        {
            OnTokenValidated = context =>
            {
                if(context.Principal != null){
                    var roleClaim = context.Principal.FindFirst(ClaimTypes.Role)?.Value;

                    if (roleClaim != null)
                    {
                        var roleJson = JsonSerializer.Deserialize<JsonElement>(roleClaim);
                        var roleName = roleJson.GetProperty("name").GetString()?.ToLower();

                        if (!string.IsNullOrEmpty(roleName) && context.Principal.Identity != null)
                        {
                            var claims = context.Principal.Claims.ToList();
                            claims.Add(new Claim(ClaimTypes.Role, roleName));
                            var newIdentity = new ClaimsIdentity(claims, context.Principal.Identity.AuthenticationType);
                            var newPrincipal = new ClaimsPrincipal(newIdentity);
                            context.Principal = newPrincipal;
                        }
                    }
                }

                return Task.CompletedTask;
            }
        };

    });

builder.Services.AddAuthorization(options =>
{
    options.AddPolicy("AdminOnly", policy => policy.RequireRole("admin"));
});

builder.Services.AddAuthorization(options =>
{
    options.AddPolicy("AdminOrViewer", policy =>
        policy.RequireRole("admin", "viewer"));
});

builder.Services.AddCors(options =>
{
    options.AddPolicy("AllowNextJs", policy =>
        policy.WithOrigins("http://localhost:3000")
              .AllowAnyHeader()
              .AllowAnyMethod()
              .AllowCredentials());
});

builder.Services.AddEndpointsApiExplorer();

builder.Services.AddScoped<SeedService>();

var app = builder.Build();

using (var scope = app.Services.CreateScope())
{
    var seedService = scope.ServiceProvider.GetRequiredService<SeedService>();
    var context = scope.ServiceProvider.GetRequiredService<AppDbContext>();

    await context.Database.EnsureCreatedAsync();

    if (!await context.Users.AnyAsync())
    {
        await seedService.SeedAsync();
    }
}

app.UseHttpsRedirection();
app.UseCors("AllowNextJs");
app.UseAuthentication();
app.UseAuthorization();

app.MapControllers();

app.Run();