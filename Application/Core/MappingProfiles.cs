using System;
using Application.Activities.DTOs;
using Application.Profiles.DTOs;
using AutoMapper;
using Domain;

namespace Application.Core;

public class MappingProfiles : Profile
{
    public MappingProfiles()
    {
        string? currentUserId =null;
        CreateMap<Activity, Activity>(); //mapiramo properties iz jedne activity u drugu(koju unosimo)
        CreateMap<CreateActivityDto, Activity>(); 
        CreateMap<EditActivityDto,Activity> ();
        CreateMap<Activity, ActivityDto>()
            .ForMember(d => d.HostId, o => o.MapFrom(s =>  //Za destinaciju HostId, uzmi vrijednost iz source-a po ovoj logici:
                s.Attendees.FirstOrDefault(x => x.IsHost)!.User.Id)) //Nađi prvog clana koji je domaćin  i uzmi ID tog korisnika 
            .ForMember(d => d.HostDisplayName, o => o.MapFrom(s => 
                s.Attendees.FirstOrDefault(x => x.IsHost)!.User.DisplayName)); //Isti domaćin, ali uzmi njegovo prikazano ime

        CreateMap<ActivityAttendee, UserProfile>()
        //d=Destination o=Options s =source
            .ForMember(d => d.DisplayName, o => o.MapFrom(s => s.User.DisplayName))  //UserProfile.DisplayName = Attendee.User.DisplayName
            .ForMember(d => d.Id, o => o.MapFrom(s => s.User.Id))
            .ForMember(d => d.Bio, o => o.MapFrom(s => s.User.Bio))
            .ForMember(d => d.ImageUrl, o => o.MapFrom(s => s.User.ImageUrl))
            .ForMember(d => d.FollowersCount, o => o.MapFrom(s => s.User.Followers.Count))
            .ForMember(d => d.FollowingCount, o => o.MapFrom(s => s.User.Followings.Count))
            .ForMember(d => d.Following, o => o.MapFrom(s => 
                s.User.Followers.Any(f => f.ObserverId == currentUserId)));

        CreateMap<User, UserProfile>()  //kada korisnk zeli da dobije profil drugog korisnika
            .ForMember(d => d.FollowersCount, o => o.MapFrom(s => s.Followers.Count))
            .ForMember(d => d.FollowingCount, o => o.MapFrom(s => s.Followings.Count))
            .ForMember(d => d.Following, o => o.MapFrom(s => 
                s.Followers.Any(f => f.ObserverId == currentUserId)));  //Provjerava da li u kolekciji Followers tog korisnika 
                // postoji zapis gdje je ObserverId jednak ID-ju trenutno ulogovanog korisnika. , tj da li ga trenutno ulogovani korisnik prati
                //"Postavi Following na true ako trenutni korisnik prati ovu osobu, inače false."

         CreateMap<Comment, CommentDto>()  //pisemo pravila za polja koja zavise od usera ili activity 
            .ForMember(d => d.DisplayName, o => o.MapFrom(s => s.User.DisplayName))
            .ForMember(d => d.UserId, o => o.MapFrom(s => s.User.Id))
            .ForMember(d => d.ImageUrl, o => o.MapFrom(s => s.User.ImageUrl));

    
    }
}
//treba dodati servis i u program.cs