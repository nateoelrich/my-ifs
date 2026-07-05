using Microsoft.AspNetCore.Mvc;
using MyIfs.Api.Models;
using MyIfs.Api.Services;

namespace MyIfs.Api.Controllers;

[ApiController]
[Route("api/auth")]
public class AuthController : ControllerBase
{
    private readonly AuthService _auth;

    public AuthController(AuthService auth) => _auth = auth;

    [HttpPost("register")]
    public async Task<IActionResult> Register(RegisterRequest req)
    {
        if (string.IsNullOrWhiteSpace(req.Email) || string.IsNullOrWhiteSpace(req.Password))
            return BadRequest("Email and password are required.");

        if (req.Password.Length < 8)
            return BadRequest("Password must be at least 8 characters.");

        var result = await _auth.RegisterAsync(req.Email, req.Password);
        if (result == null) return Conflict("An account with that email already exists.");

        return Ok(result);
    }

    [HttpPost("login")]
    public async Task<IActionResult> Login(LoginRequest req)
    {
        var result = await _auth.LoginAsync(req.Email, req.Password);
        if (result == null) return Unauthorized("Invalid email or password.");
        return Ok(result);
    }

    [HttpPost("refresh")]
    public async Task<IActionResult> Refresh(RefreshRequest req)
    {
        var result = await _auth.RefreshAsync(req.RefreshToken);
        if (result == null) return Unauthorized("Invalid or expired refresh token.");
        return Ok(result);
    }
}
