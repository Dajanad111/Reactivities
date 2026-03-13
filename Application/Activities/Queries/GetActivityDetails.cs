using System;
using Application.Activities.DTOs;
using Application.Core;
using Application.Interfaces;
using AutoMapper;
using AutoMapper.QueryableExtensions;
using Domain;
using MediatR;
using Microsoft.EntityFrameworkCore;
using Persistence;

namespace Application.Activities.Queries;

public class GetActivityDetails
{
    public class Query : IRequest<Result<ActivityDto>> //vraca nam jedan activity iz result.cs
    {
        public required string Id { get; set; } //property id da bi pronasli odredjenu activity
    }

    public class Handler(AppDbContext context, IMapper mapper,IUserAccessor userAccessor) : IRequestHandler<Query, Result<ActivityDto>>
    {
        public async Task<Result<ActivityDto>> Handle(Query request, CancellationToken cancellationToken)//imamo query request
        {
            var activity = await context.Activities
            .ProjectTo<ActivityDto> (mapper.ConfigurationProvider ,  //Baza vraća samo kolone koje trebaju za DTO
              new { currentUserId = userAccessor.GetUserId() })
            .FirstOrDefaultAsync(x => request.Id == x.Id, cancellationToken); //Traži prvi Activity čiji Id odgovara request.Id
            //Ako nađe → vraća taj Activity (sa učitanim Attendees i Users)
            if(activity==null) 
                  return Result<ActivityDto>.Failure ("Activity not found", 404); //result.cs parametri u slucaju failure

            return Result<ActivityDto>.Success(activity); //result.cs  u slucaju success
        }
    }
}
