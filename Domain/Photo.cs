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

    [JsonIgnore]  //Kada pretvaraš ovaj objekat u JSON (za slanje klijentu), POTPUNO preskoči ovo polje.
    //jer ako udje u njega opet ce dodati sliku i tako u nedogled
    // /Prekida petlju – User se ne šalje unutar Photo
    public User User { get; set; } = null!;
}