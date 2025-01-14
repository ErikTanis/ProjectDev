using System.ComponentModel.DataAnnotations;
using System.IdentityModel.Tokens.Jwt;
using System.Security.Claims;
using System.Text;

using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Mvc;
using Microsoft.IdentityModel.Tokens;

using Newtonsoft.Json.Linq;

using StarterKit.Models;
using StarterKit.Services;

namespace StarterKit.Controllers;

[Route("api/v1/auth")]
[ApiController]
public class AuthController(IAuthService service) : Controller
{
    private readonly IAuthService _service = service;

    [HttpPost("login")]
    public async Task<IActionResult> Login([FromBody] LoginBody body)
    {
        if (body is null || !ModelState.IsValid)
            return BadRequest(ModelState.Values.SelectMany(v => v.Errors).Select(e => e.ErrorMessage).ToList());
        if (await _service.CheckPasswordAsync(body.Username, body.Password) != LoginStatus.Success)
            return Unauthorized();

        return await _service.GetTokenAsync(body.Username) is null
            ? Unauthorized()
            : Ok(await _service.GetTokenAsync(body.Username));
    }

    [HttpPost("register")]
    public async Task<IActionResult> Register([FromBody] RegisterBody body)
    {
        if (body is null || !ModelState.IsValid)
            return BadRequest(ModelState.Values.SelectMany(v => v.Errors).Select(e => e.ErrorMessage).ToList());
        if (await _service.GetByUsername(body.Username) is not null)
            return BadRequest();
        if (await _service.GetByEmail(body.Email) is not null)
            return BadRequest();

        var result = await _service.RegisterAsync(
            body.Username,
            body.Password,
            body.Email,
            body.FirstName,
            body.LastName);
        return result ? Ok("Registered") : BadRequest();
    }

    [HttpPost("revoke"), Authorize]
    public async Task<IActionResult> Revoke([FromBody] RevokeTokenBody body)
    {
        var userid = User.FindFirst(ClaimTypes.NameIdentifier)?.Value;
        if (string.IsNullOrEmpty(userid))
            return Unauthorized();
        if (string.IsNullOrEmpty(body.Token) || !ModelState.IsValid)
            return BadRequest("Token is empty");

        return await _service.RevokeAsync(userid, body.Token)
            ? Ok(new { Message = "Token revoked successfully." })
            : BadRequest();
    }

    [HttpPost("change-password"), Authorize]
    public async Task<IActionResult> ChangePassword([FromBody] ChangePasswordBody body)
    {
        if (string.IsNullOrEmpty(body.Username) || string.IsNullOrEmpty(body.Password) || string.IsNullOrEmpty(body.NewPassword))
            return BadRequest("Username, password or new password is empty");
        if (await _service.GetByUsername(body.Username) is not ApplicationUser user)
            return Unauthorized();
        if (User.FindFirst(ClaimTypes.NameIdentifier)?.Value is not string userId || userId != user.Id)
            return Unauthorized();

        return await _service.ChangePasswordAsync(user, body.Password, body.NewPassword)
            ? Ok("Password changed")
            : BadRequest();
    }

    [HttpPost("change-role")]//, Authorize, AdminOnly]
    public async Task<IActionResult> ChangeRole([FromBody] ChangeRoleBody body)
    {
        if (string.IsNullOrEmpty(body.Username) || body.Roles is null || body.Roles.Length == 0)
            return BadRequest("Username or roles is empty");
        if (await _service.GetByUsername(body.Username) is not ApplicationUser user)
            return BadRequest();

        return await _service.ChangeRoleAsync(user, body.Roles)
            ? Ok()
            : BadRequest();
    }

    [HttpPost("update-user"), Authorize(Roles = "Admin")]
    public async Task<IActionResult> UpdateUser([FromBody] UpdateUserBody body)
    {
        if (string.IsNullOrEmpty(body.FirstName) && string.IsNullOrEmpty(body.LastName))
            return BadRequest("First name or last name is empty");
        if (string.IsNullOrEmpty(body.Username))
            return BadRequest("Username is empty");
        if (await _service.GetByUsername(body.Username) is not ApplicationUser user)
            return BadRequest();
        if (User.FindFirst(ClaimTypes.NameIdentifier)?.Value != user.Id)
            return Unauthorized();

        return await _service.UpdateUserAsync(user, body.FirstName, body.LastName)
            ? Ok()
            : BadRequest();
    }

    [HttpGet("is-admin"), Authorize(Roles = "Admin")]
    public IActionResult IsAdmin() => Ok();


}

public class RevokeTokenBody
{
    [Required(ErrorMessage = "Token is required")]
    public required string Token { get; set; }
}

public class UpdateUserBody
{
    [Required]
    public required string Username { get; set; }
    [Required]
    public required string FirstName { get; set; }
    [Required]
    public required string LastName { get; set; }
}

public class ChangeRoleBody
{
    public string? Username { get; set; }
    public string[]? Roles { get; set; }
}

public class LoginBody
{
    [Required]
    public required string Username { get; set; }

    [Required]
    public required string Password { get; set; }
}

public class RegisterBody
{
    [Required]
    public required string Username { get; set; }
    [Required]
    public required string Password { get; set; }
    [Required]
    public required string Email { get; set; }
    [Required]
    public required string FirstName { get; set; }
    [Required]
    public required string LastName { get; set; }
}

public class ChangePasswordBody
{
    [Required]
    public required string Username { get; set; }
    [Required]
    public required string Password { get; set; }
    [Required]
    public required string NewPassword { get; set; }
}