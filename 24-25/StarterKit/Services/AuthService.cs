using System.IdentityModel.Tokens.Jwt;
using System.Security.Claims;
using System.Text;

using Microsoft.AspNetCore.Identity;
using Microsoft.IdentityModel.Tokens;

using Newtonsoft.Json.Linq;

using StarterKit.Models;

namespace StarterKit.Services;

public enum LoginStatus { IncorrectPassword, IncorrectUsername, Success }

public enum ADMIN_SESSION_KEY { adminLoggedIn }

public class AuthService(UserManager<ApplicationUser> userManager, IConfiguration configuration) : IAuthService
{
    private readonly UserManager<ApplicationUser> _userManager = userManager;
    private readonly IConfiguration _configuration = configuration;

    public LoginStatus CheckPassword(string username, string inputPassword)
    {
        var user = _userManager.FindByNameAsync(username).Result;
        if (user == null)
            return LoginStatus.IncorrectUsername;

        return _userManager.CheckPasswordAsync(user, inputPassword).Result
            ? LoginStatus.Success
            : LoginStatus.IncorrectPassword;
    }

    public async Task<LoginStatus> CheckPasswordAsync(string username, string inputPassword)
    {
        var user = await _userManager.FindByNameAsync(username);
        if (user == null)
            return LoginStatus.IncorrectUsername;

        return await _userManager.CheckPasswordAsync(user, inputPassword)
            ? LoginStatus.Success
            : LoginStatus.IncorrectPassword;
    }

    public async Task<AccessToken?> GetTokenAsync(string username)
    {
        var jwtKey = _configuration["Jwt:Key"];
        ArgumentNullException.ThrowIfNullOrEmpty(jwtKey, "Jwt:Key is missing in appsettings.json");

        var user = await _userManager.FindByNameAsync(username);
        if (user == null)
            return null;

        var jti = Guid.NewGuid().ToString();
        await _userManager.SetAuthenticationTokenAsync(user, "JWT", "AccessToken", jti);
        SymmetricSecurityKey signingKey = new(Encoding.UTF8.GetBytes(jwtKey));
        var userRoles = await _userManager.GetRolesAsync(user);
        var claims = new List<Claim>
        {
            new Claim(ClaimTypes.Name, user.UserName!),
            new Claim(JwtRegisteredClaimNames.Jti, jti),
            new Claim(ClaimTypes.NameIdentifier, user.Id)
        };
        claims.AddRange(userRoles.Select(role => new Claim(ClaimTypes.Role, role)));

        return GenerateToken(claims, signingKey);
    }

    public async Task<bool> RegisterAsync(string username, string password, string email, string firstName, string lastName)
    {
        var user = new ApplicationUser
        {
            UserName = username,
            FirstName = firstName,
            LastName = lastName,
            Email = email,
            SecurityStamp = Guid.NewGuid().ToString()
        };

        var result = await _userManager.CreateAsync(user, password);
        if (!result.Succeeded)
            return false;

        return (await _userManager.AddToRoleAsync(user, "user")).Succeeded;
    }

    public async Task<bool> RevokeAsync(string userid, string token)
    {
        JwtSecurityTokenHandler tokenHandler = new();
        var jwtToken = tokenHandler.ReadJwtToken(token);

        var tokenUserId = jwtToken.Claims.FirstOrDefault(c => c.Type == ClaimTypes.NameIdentifier)?.Value;
        if (tokenUserId != userid)
            return false;

        var username = jwtToken.Claims.FirstOrDefault(c => c.Type == ClaimTypes.Name)?.Value;
        var jti = jwtToken.Claims.FirstOrDefault(c => c.Type == JwtRegisteredClaimNames.Jti)?.Value;
        if (jti == null || username == null)
            return false;

        if (await _userManager.FindByNameAsync(username) is not ApplicationUser user)
            return false;

        var storedJti = await _userManager.GetAuthenticationTokenAsync(user, "JWT", "AccessToken");
        if (storedJti != jti)
            return false;

        var result = await _userManager.RemoveAuthenticationTokenAsync(user, "JWT", "AccessToken");
        if (!result.Succeeded)
            return false;

        return true;
    }

    public async Task<bool> ChangePasswordAsync(ApplicationUser user, string password, string newPassword)
    {
        var result = await _userManager.ChangePasswordAsync(user, password, newPassword);
        return result.Succeeded;
    }

    public async Task<bool> ChangeRoleAsync(ApplicationUser user, string[] roles)
    {
        var userRoles = await _userManager.GetRolesAsync(user);
        var result = await _userManager.RemoveFromRolesAsync(user, userRoles);
        if (!result.Succeeded)
            return false;

        return (await _userManager.AddToRolesAsync(user, roles)).Succeeded;
    }

    public async Task<bool> UpdateUserAsync(ApplicationUser user, string? firstName, string? lastName)
    {
        if (!string.IsNullOrEmpty(firstName))
            user.FirstName = firstName;
        if (!string.IsNullOrEmpty(lastName))
            user.LastName = lastName;

        var result = await _userManager.UpdateAsync(user);
        return result.Succeeded;
    }

    public async Task<ApplicationUser?> GetByUsername(string username) =>
        await _userManager.FindByNameAsync(username);

    public async Task<ApplicationUser?> GetByEmail(string email) =>
        await _userManager.FindByEmailAsync(email);

    private AccessToken GenerateToken(List<Claim> claims, SymmetricSecurityKey authSigningKey)
    {
        var token = new JwtSecurityToken(
            issuer: _configuration["Jwt:Issuer"],
            audience: _configuration["Jwt:Audience"],
            expires: DateTime.Now.AddMinutes(Convert.ToDouble(_configuration["Jwt:ExpireMinutes"])),
            claims: claims,
            signingCredentials: new SigningCredentials(authSigningKey, SecurityAlgorithms.HmacSha256)
        );

        JwtSecurityTokenHandler tokenHandler = new();
        var jwtToken = tokenHandler.WriteToken(token);

        return new AccessToken(jwtToken, token.ValidTo);
    }
}
public record AccessToken(string Token, DateTime Expiration);