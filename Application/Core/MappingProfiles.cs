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
            .ForMember(d => d.ImageUrl, o => o.MapFrom(s => s.User.ImageUrl));
        CreateMap<User, UserProfile>();  //kada korisnk zeli da dobije profil drugog korisnika
    }
}
//treba dodati servis i u program.cs