using System;
using System.Text.Json.Serialization;

namespace Domain;

public class Photo
{
    public string Id { get; set; } = Guid.NewGuid().ToString();
    public required string Url { get; set; }
    public required string PublicId { get; set; } //dobijamo iz cloudinary

    // navigation properties
    public required string UserId { get; set; }  //fk

    [JsonIgnore]  //kada bi serializer pravio JSON od Photo, ušao bi u User,
    //  koji ima Photos, koji ima User... i tako u nedogled – beskonačna petlja. 
    // [JsonIgnore] prekida tu petlju.
    public User User { get; set; } = null!;
}