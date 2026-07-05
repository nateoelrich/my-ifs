using System.IdentityModel.Tokens.Jwt;
using System.Security.Claims;
using System.Security.Cryptography;
using System.Text;
using Microsoft.IdentityModel.Tokens;
using MongoDB.Bson;
using MongoDB.Driver;
using MyIfs.Api.Models;

namespace MyIfs.Api.Services;

public class AuthService
{
    private readonly IMongoCollection<User> _users;
    private readonly IConfiguration _config;

    public AuthService(IMongoDatabase db, IConfiguration config)
    {
        _users = db.GetCollection<User>("users");
        _config = config;
    }

    public async Task<AuthResponse?> RegisterAsync(string email, string password)
    {
        var existing = await _users.Find(u => u.Email == email.ToLowerInvariant()).FirstOrDefaultAsync();
        if (existing != null) return null;

        var userId = ObjectId.GenerateNewId().ToString();
        var (accessToken, refreshToken) = GenerateTokens(userId, email.ToLowerInvariant());

        var user = new User
        {
            Id = userId,
            Email = email.ToLowerInvariant(),
            PasswordHash = BCrypt.Net.BCrypt.HashPassword(password),
            RefreshToken = refreshToken,
            RefreshTokenExpiry = DateTime.UtcNow.AddDays(7)
        };

        await _users.InsertOneAsync(user);

        return new AuthResponse(accessToken, refreshToken, userId, user.Email);
    }

    public async Task<AuthResponse?> LoginAsync(string email, string password)
    {
        var user = await _users.Find(u => u.Email == email.ToLowerInvariant()).FirstOrDefaultAsync();
        if (user == null || !BCrypt.Net.BCrypt.Verify(password, user.PasswordHash)) return null;

        var (accessToken, refreshToken) = GenerateTokens(user.Id, user.Email);

        var update = Builders<User>.Update
            .Set(u => u.RefreshToken, refreshToken)
            .Set(u => u.RefreshTokenExpiry, DateTime.UtcNow.AddDays(7));
        await _users.UpdateOneAsync(u => u.Id == user.Id, update);

        return new AuthResponse(accessToken, refreshToken, user.Id, user.Email);
    }

    public async Task<AuthResponse?> RefreshAsync(string refreshToken)
    {
        var user = await _users.Find(u =>
            u.RefreshToken == refreshToken &&
            u.RefreshTokenExpiry > DateTime.UtcNow
        ).FirstOrDefaultAsync();

        if (user == null) return null;

        var (accessToken, newRefreshToken) = GenerateTokens(user.Id, user.Email);

        var update = Builders<User>.Update
            .Set(u => u.RefreshToken, newRefreshToken)
            .Set(u => u.RefreshTokenExpiry, DateTime.UtcNow.AddDays(7));
        await _users.UpdateOneAsync(u => u.Id == user.Id, update);

        return new AuthResponse(accessToken, newRefreshToken, user.Id, user.Email);
    }

    private (string accessToken, string refreshToken) GenerateTokens(string userId, string email)
    {
        var key = new SymmetricSecurityKey(Encoding.UTF8.GetBytes(_config["Jwt:Secret"]!));
        var creds = new SigningCredentials(key, SecurityAlgorithms.HmacSha256);

        var claims = new[]
        {
            new Claim(ClaimTypes.NameIdentifier, userId),
            new Claim(ClaimTypes.Email, email),
            new Claim(JwtRegisteredClaimNames.Jti, Guid.NewGuid().ToString())
        };

        var token = new JwtSecurityToken(
            issuer: _config["Jwt:Issuer"],
            audience: _config["Jwt:Audience"],
            claims: claims,
            expires: DateTime.UtcNow.AddMinutes(15),
            signingCredentials: creds
        );

        var accessToken = new JwtSecurityTokenHandler().WriteToken(token);
        var refreshToken = Convert.ToBase64String(RandomNumberGenerator.GetBytes(64));

        return (accessToken, refreshToken);
    }
}
