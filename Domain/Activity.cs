using System;
using Microsoft.EntityFrameworkCore;

namespace Domain;

[Index (nameof(Date))] //instrukcija za Entity Framework Core da u bazi podataka kreira indeks za kolonu Date.

public class Activity
{
public string Id { get; set; } = Guid.NewGuid().ToString();
public required string Title { get; set; }
public DateTime Date { get; set; }
public required string Description { get; set; }
public required string Category { get; set; }
public bool IsCancelled { get; set; }
 
  //location

  public required string City { get; set; }
  public required string Venue{ get; set; }
  public double Latitude { get; set; }
  public double Longitude { get; set; }

  // navigation properties
    public ICollection<ActivityAttendee> Attendees { get; set; } = [];  //activity moze imati vise attendees
        //pravimo u appdbcontext pravilo kako da se povezu 
    public ICollection<Comment> Comments {get; set;} = [] ;  //activity ima vise komentara 
    // //pravimo u appdbcontext pravilo kako da se povezu 
    //ne rpavimo kolekciju za usera i comments jer neced nigdje biti prikazani svi njegovi komentari na jednom mjestu 


}
