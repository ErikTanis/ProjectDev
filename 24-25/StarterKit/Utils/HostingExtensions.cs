using Microsoft.AspNetCore.Authentication.JwtBearer;
using Microsoft.AspNetCore.Identity;
using Microsoft.EntityFrameworkCore;
using Microsoft.IdentityModel.JsonWebTokens;
using Microsoft.IdentityModel.Tokens;

using StarterKit.Models;

using System.Security.Claims;
using System.Text;

namespace StarterKit.Utils;

public static class HostingExtensions
{
    public static WebApplicationBuilder ConfigureDatabase(this WebApplicationBuilder builder)
    {
        var connectionString = builder.Configuration.GetConnectionString("SqlLiteDb");
        ArgumentNullException.ThrowIfNullOrEmpty(connectionString, "SqlLiteDb connection string is missing in appsettings.json");

        builder.Services.AddDbContext<DatabaseContext>(
            options => options.UseSqlite(connectionString));

        return builder;
    }

    public static WebApplicationBuilder ConfigureAuthentication(this WebApplicationBuilder builder)
    {
        var jwtKey = builder.Configuration["Jwt:Key"];
        ArgumentNullException.ThrowIfNullOrEmpty(jwtKey, "Jwt:Key is missing in appsettings.json");
        var jwtIssuer = builder.Configuration["Jwt:Issuer"];
        ArgumentNullException.ThrowIfNullOrEmpty(jwtIssuer, "Jwt:Issuer is missing in appsettings.json");
        var jwtAudience = builder.Configuration["Jwt:Audience"];
        ArgumentNullException.ThrowIfNullOrEmpty(jwtAudience, "Jwt:Audience is missing in appsettings.json");
        var jwtExpireMinutes = builder.Configuration["Jwt:ExpireMinutes"];
        ArgumentNullException.ThrowIfNullOrEmpty(jwtExpireMinutes, "Jwt:ExpireMinutes is missing in appsettings.json");

        builder.Services.AddIdentity<ApplicationUser, IdentityRole>()
            .AddEntityFrameworkStores<DatabaseContext>()
            .AddDefaultTokenProviders()
            .Services.AddAuthentication(options =>
            {
                options.DefaultAuthenticateScheme = JwtBearerDefaults.AuthenticationScheme;
                options.DefaultChallengeScheme = JwtBearerDefaults.AuthenticationScheme;
            })
            .AddJwtBearer(options =>
            {
                options.TokenValidationParameters = new TokenValidationParameters
                {
                    ValidateIssuer = true,
                    ValidateAudience = true,
                    ValidateLifetime = true,
                    ValidateIssuerSigningKey = true,
                    ValidIssuer = jwtIssuer,
                    ValidAudience = jwtAudience,
                    IssuerSigningKey = new SymmetricSecurityKey(Encoding.UTF8.GetBytes(jwtKey))
                };
                options.Events = new JwtBearerEvents
                {
                    OnTokenValidated = async context =>
                    {
                        var userManager = context.HttpContext.RequestServices.GetRequiredService<UserManager<ApplicationUser>>();
                        JsonWebToken? jwtToken = context.SecurityToken as JsonWebToken;

                        var jti = jwtToken?.Claims.FirstOrDefault(c => c.Type == JwtRegisteredClaimNames.Jti)?.Value;
                        var username = jwtToken?.Claims.FirstOrDefault(c => c.Type == ClaimTypes.Name)?.Value;
                        if (jti == null || username == null)
                        {
                            context.Fail("Invalid token.");
                            return;
                        }

                        var user = await userManager.FindByNameAsync(username);
                        if (user == null)
                        {
                            context.Fail("User not found.");
                            return;
                        }

                        var tokenValue = await userManager.GetAuthenticationTokenAsync(user, "JWT", "AccessToken");
                        if (tokenValue != jti)
                            context.Fail("This token has been revoked.");
                    }
                };
            })
            .Services.AddAuthorization();

        return builder;
    }

    public static async Task<WebApplication> EnsureDefaultAccountExistsAsync(this WebApplication builder)
    {
        var username = builder.Configuration["DefaultAccount:Username"];
        ArgumentNullException.ThrowIfNullOrEmpty(username, "DefaultAdmin:Username is missing in appsettings.json");
        var password = builder.Configuration["DefaultAccount:Password"];
        ArgumentNullException.ThrowIfNullOrEmpty(password, "DefaultAdmin:Password is missing in appsettings.json");
        var email = builder.Configuration["DefaultAccount:Email"];
        ArgumentNullException.ThrowIfNullOrEmpty(email, "DefaultAdmin:Email is missing in appsettings.json");

        using var scope = builder.Services.CreateScope();
        var roleManager = scope.ServiceProvider.GetRequiredService<RoleManager<IdentityRole>>();
        if (await roleManager.FindByNameAsync("admin") is null)
        {
            var result = await roleManager.CreateAsync(new IdentityRole { Name = "admin" });
            if(!result.Succeeded){
                throw new Exception("Failed to create admin role.");}
        }
        if (await roleManager.FindByNameAsync("user") is null)
        {
            var result = await roleManager.CreateAsync(new IdentityRole { Name = "user" });
            if (!result.Succeeded)
                throw new Exception("Failed to create user role.");
        }

        var userManager = scope.ServiceProvider.GetRequiredService<UserManager<ApplicationUser>>();
        if (await userManager.FindByNameAsync("admin") is not ApplicationUser adminUser)
        {
            adminUser = new ApplicationUser
            {
                FirstName = username,
                LastName = username,
                UserName = username,
                Email = email
            };
            
            var result = await userManager.CreateAsync(adminUser, password);
            if (!result.Succeeded){
                var errors = string.Join(", ", result.Errors.Select(e => e.Description));
                throw new Exception($"Failed to create admin role. Errors: {errors}");
            }
        }

        if (!await userManager.IsInRoleAsync(adminUser, "admin"))
        {
            var result = await userManager.AddToRoleAsync(adminUser, "admin");
            if (!result.Succeeded)
                throw new Exception("Failed to add admin role to admin user.");
        }

        return builder;
    }
}
