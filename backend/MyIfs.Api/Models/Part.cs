using MongoDB.Bson;
using MongoDB.Bson.Serialization.Attributes;

namespace MyIfs.Api.Models;

public class Part
{
    [BsonId]
    [BsonRepresentation(BsonType.ObjectId)]
    public string Id { get; set; } = null!;

    [BsonElement("userId")]
    [BsonRepresentation(BsonType.ObjectId)]
    public string UserId { get; set; } = null!;

    // Identity
    [BsonElement("name")]
    public string Name { get; set; } = null!;

    [BsonElement("nickname")]
    public string? Nickname { get; set; }

    [BsonElement("roleType")]
    public string? RoleType { get; set; }  // exile | manager | firefighter | unknown

    [BsonElement("color")]
    public string? Color { get; set; }

    // Body & Sensation
    [BsonElement("bodyLocation")]
    public string? BodyLocation { get; set; }

    [BsonElement("bodySensation")]
    public string? BodySensation { get; set; }

    // Image & Appearance
    [BsonElement("image")]
    public string? Image { get; set; }

    [BsonElement("apparentAge")]
    public string? ApparentAge { get; set; }

    // Emotional & Cognitive Profile
    [BsonElement("emotions")]
    public List<string> Emotions { get; set; } = [];

    [BsonElement("beliefs")]
    public List<string> Beliefs { get; set; } = [];

    [BsonElement("triggers")]
    public List<string> Triggers { get; set; } = [];

    // Protective Function
    [BsonElement("positiveIntention")]
    public string? PositiveIntention { get; set; }

    [BsonElement("fears")]
    public List<string> Fears { get; set; } = [];

    [BsonElement("whatItNeedsFromSelf")]
    public string? WhatItNeedsFromSelf { get; set; }

    // Origin
    [BsonElement("originLifeStage")]
    public string? OriginLifeStage { get; set; }

    [BsonElement("originStory")]
    public string? OriginStory { get; set; }

    // Gifts
    [BsonElement("giftsWhenUnburdened")]
    public string? GiftsWhenUnburdened { get; set; }

    // Free-form
    [BsonElement("notes")]
    public string? Notes { get; set; }

    // Meta
    [BsonElement("createdAt")]
    public DateTime CreatedAt { get; set; } = DateTime.UtcNow;

    [BsonElement("updatedAt")]
    public DateTime UpdatedAt { get; set; } = DateTime.UtcNow;
}

public class PartSummary
{
    public string Id { get; set; } = null!;
    public string Name { get; set; } = null!;
    public string? Nickname { get; set; }
    public string? RoleType { get; set; }
    public string? Color { get; set; }
    public string? BodyLocation { get; set; }
    public DateTime CreatedAt { get; set; }
}

public class CreatePartRequest
{
    public string Name { get; set; } = null!;
    public string? Nickname { get; set; }
    public string? RoleType { get; set; }
    public string? Color { get; set; }
    public string? BodyLocation { get; set; }
    public string? BodySensation { get; set; }
    public string? Image { get; set; }
    public string? ApparentAge { get; set; }
    public List<string> Emotions { get; set; } = [];
    public List<string> Beliefs { get; set; } = [];
    public List<string> Triggers { get; set; } = [];
    public string? PositiveIntention { get; set; }
    public List<string> Fears { get; set; } = [];
    public string? WhatItNeedsFromSelf { get; set; }
    public string? OriginLifeStage { get; set; }
    public string? OriginStory { get; set; }
    public string? GiftsWhenUnburdened { get; set; }
    public string? Notes { get; set; }
}

public class UpdatePartRequest : CreatePartRequest { }
