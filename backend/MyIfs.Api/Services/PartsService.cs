using MongoDB.Bson;
using MongoDB.Driver;
using MyIfs.Api.Models;

namespace MyIfs.Api.Services;

public class PartsService
{
    private readonly IMongoCollection<Part> _parts;

    public PartsService(IMongoDatabase db)
    {
        _parts = db.GetCollection<Part>("parts");
    }

    public async Task<List<PartSummary>> GetAllAsync(string userId)
    {
        var parts = await _parts
            .Find(p => p.UserId == userId)
            .SortByDescending(p => p.CreatedAt)
            .ToListAsync();

        return parts.Select(p => new PartSummary
        {
            Id = p.Id,
            Name = p.Name,
            Nickname = p.Nickname,
            RoleType = p.RoleType,
            Color = p.Color,
            BodyLocation = p.BodyLocation,
            CreatedAt = p.CreatedAt
        }).ToList();
    }

    public async Task<Part?> GetByIdAsync(string id, string userId)
    {
        var part = await _parts.Find(p => p.Id == id).FirstOrDefaultAsync();
        if (part?.UserId != userId) return null;
        return part;
    }

    public async Task<Part> CreateAsync(string userId, CreatePartRequest req)
    {
        var part = new Part
        {
            UserId = userId,
            Name = req.Name,
            Nickname = req.Nickname,
            RoleType = req.RoleType,
            Color = req.Color,
            BodyLocation = req.BodyLocation,
            BodySensation = req.BodySensation,
            Image = req.Image,
            ApparentAge = req.ApparentAge,
            Emotions = req.Emotions,
            Beliefs = req.Beliefs,
            Triggers = req.Triggers,
            PositiveIntention = req.PositiveIntention,
            Fears = req.Fears,
            WhatItNeedsFromSelf = req.WhatItNeedsFromSelf,
            OriginLifeStage = req.OriginLifeStage,
            OriginStory = req.OriginStory,
            GiftsWhenUnburdened = req.GiftsWhenUnburdened,
            Notes = req.Notes
        };

        await _parts.InsertOneAsync(part);
        return part;
    }

    public async Task<Part?> UpdateAsync(string id, string userId, UpdatePartRequest req)
    {
        var existing = await _parts.Find(p => p.Id == id).FirstOrDefaultAsync();
        if (existing?.UserId != userId) return null;

        var update = Builders<Part>.Update
            .Set(p => p.Name, req.Name)
            .Set(p => p.Nickname, req.Nickname)
            .Set(p => p.RoleType, req.RoleType)
            .Set(p => p.Color, req.Color)
            .Set(p => p.BodyLocation, req.BodyLocation)
            .Set(p => p.BodySensation, req.BodySensation)
            .Set(p => p.Image, req.Image)
            .Set(p => p.ApparentAge, req.ApparentAge)
            .Set(p => p.Emotions, req.Emotions)
            .Set(p => p.Beliefs, req.Beliefs)
            .Set(p => p.Triggers, req.Triggers)
            .Set(p => p.PositiveIntention, req.PositiveIntention)
            .Set(p => p.Fears, req.Fears)
            .Set(p => p.WhatItNeedsFromSelf, req.WhatItNeedsFromSelf)
            .Set(p => p.OriginLifeStage, req.OriginLifeStage)
            .Set(p => p.OriginStory, req.OriginStory)
            .Set(p => p.GiftsWhenUnburdened, req.GiftsWhenUnburdened)
            .Set(p => p.Notes, req.Notes)
            .Set(p => p.UpdatedAt, DateTime.UtcNow);

        var options = new FindOneAndUpdateOptions<Part, Part> { ReturnDocument = ReturnDocument.After };
        return await _parts.FindOneAndUpdateAsync<Part, Part>(p => p.Id == id, update, options);
    }

    public async Task<bool> DeleteAsync(string id, string userId)
    {
        var result = await _parts.DeleteOneAsync(p => p.Id == id && p.UserId == userId);
        return result.DeletedCount > 0;
    }
}
