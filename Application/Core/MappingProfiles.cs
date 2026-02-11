using System;
using AutoMapper;
using Domain;

namespace Application.Core;

public class MappingProfiles : Profile
{
    public MappingProfiles()
    {
        CreateMap<Activity, Activity>();  //mapiramo properties iz jedne activity u drugu(koju unosimo)
    }
}
//treba dodati servis i u program.cs