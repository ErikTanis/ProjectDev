using StarterKit.Models;

namespace StarterKit.Services;

public interface IAuthService {
    LoginStatus CheckPassword(string username, string inputPassword);
    Task<LoginStatus> CheckPasswordAsync(string username, string inputPassword);
    Task<AccessToken?> GetTokenAsync(string username);
    Task<bool> RegisterAsync(string username, string password, string email, string firstName, string lastName);
    Task<bool> RevokeAsync(string token, string token1);
    Task<bool> ChangePasswordAsync(ApplicationUser user, string password, string newPassword);
    Task<ApplicationUser?> GetByUsername(string username);
    Task<ApplicationUser?> GetByEmail(string email);
    Task<bool> ChangeRoleAsync(ApplicationUser user, string[] roles);
    Task<bool> UpdateUserAsync(ApplicationUser user, string? firstName, string? lastName);
}