using System;
using Microsoft.AspNetCore.Identity;

namespace Domain;

public class User : IdentityUser
{
    public string? DisplayName { get; set; }
    public string? Bio { get; set; }
    public string? ImageUrl { get; set; }

    // navigation properties
    public ICollection<ActivityAttendee> Activities { get; set; } = []; //user moze biti prijavljen na vise activity

    public ICollection<Photo> Photos { get; set; } = [];  //user ce imati vise slika

    //pravimo u appdbcontext pravilo kako da se povezu 

    public ICollection<UserFollowing> Followings { get; set; } = [];
    public ICollection<UserFollowing> Followers { get; set; } = [];



}
