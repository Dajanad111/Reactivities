using System;
using Application.Activities.DTOs;
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
    }
}
//treba dodati servis i u program.cs