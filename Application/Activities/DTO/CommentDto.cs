using System;

namespace Application.Activities.DTOs;

public class CommentDto //pravimo commentdto da bi prikazali samo odredjene djelove commenta, tj samo ime i sliku usera i nista od activity 
{
    public required string Id { get; set; }
    public DateTime CreatedAt { get; set; }
    public required string Body { get; set; }
    public required string UserId { get; set; }
    public required string DisplayName { get; set; } //podatak iz usera
    public string? ImageUrl { get; set; }//podatak iz usera
}