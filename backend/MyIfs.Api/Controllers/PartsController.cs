using System.Security.Claims;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using MyIfs.Api.Models;
using MyIfs.Api.Services;

namespace MyIfs.Api.Controllers;

[ApiController]
[Route("api/parts")]
[Authorize]
public class PartsController : ControllerBase
{
    private readonly PartsService _parts;

    public PartsController(PartsService parts) => _parts = parts;

    private string UserId => User.FindFirstValue(ClaimTypes.NameIdentifier)!;

    [HttpGet]
    public async Task<IActionResult> GetAll() =>
        Ok(await _parts.GetAllAsync(UserId));

    [HttpGet("{id}")]
    public async Task<IActionResult> GetById(string id)
    {
        var part = await _parts.GetByIdAsync(id, UserId);
        return part == null ? NotFound() : Ok(part);
    }

    [HttpPost]
    public async Task<IActionResult> Create(CreatePartRequest req)
    {
        if (string.IsNullOrWhiteSpace(req.Name))
            return BadRequest("Name is required.");

        var part = await _parts.CreateAsync(UserId, req);
        return CreatedAtAction(nameof(GetById), new { id = part.Id }, part);
    }

    [HttpPut("{id}")]
    public async Task<IActionResult> Update(string id, UpdatePartRequest req)
    {
        if (string.IsNullOrWhiteSpace(req.Name))
            return BadRequest("Name is required.");

        var part = await _parts.UpdateAsync(id, UserId, req);
        return part == null ? NotFound() : Ok(part);
    }

    [HttpDelete("{id}")]
    public async Task<IActionResult> Delete(string id)
    {
        var deleted = await _parts.DeleteAsync(id, UserId);
        return deleted ? NoContent() : NotFound();
    }
}
