using System;
using Application.Core;
using Application.Interfaces;
using Application.Profiles.DTOs;
using AutoMapper;
using AutoMapper.QueryableExtensions;
using Domain;
using MediatR;
using Microsoft.EntityFrameworkCore;
using Persistence;

namespace Application.Profiles.Queries;

public class GetUserActivities
{

    public class Query : IRequest<Result<List<UserActivityDto>>>
    {
        
         public required string UserId { get; set; } //Da znamo čije aktivnosti tražimo.
         public required string Filter { get; set; } //Da znamo da li tražimo "past", "future" ili "hosting".
    }

    public class Handler(AppDbContext context, IMapper mapper) : IRequestHandler<Query, Result<List<UserActivityDto>>>
    {
        public async Task<Result<List<UserActivityDto>>> Handle(Query request, CancellationToken cancellationToken)
        {
              var query = context.ActivityAttendees  //  Počinjemo sa svim aktivnostima gdje je korisnik attendee
                .Where(u => u.User.Id == request.UserId)  //pronadji u ActivityAttendees sve vezano za ovog usera
                .OrderBy(a => a.Activity.Date) //poredjaj po datumu aktivnosti
                .Select(x => x.Activity) //selektuj samo aktivnosti 
                .AsQueryable();

                var today = DateTime.UtcNow;  //danasnji datum 

                 query = request.Filter switch  
            {
                "past" => query.Where(a => a.Date <= today  //alko je filter past daj sve aktivnosti manjeg datuma od danas 
                    && a.Attendees.Any(x => x.UserId == request.UserId)), // i gdje je attendee nas user 
                "hosting" => query.Where(a => a.Attendees.Any(x => x.IsHost  //ako je filtere hosting daj svve gdje je ovaj user host 
		                && x.UserId == request.UserId)), 
                _ => query.Where(a => a.Date >= today //ostalo je za buduce akcije 
                    && a.Attendees.Any(x => x.UserId == request.UserId))
            };
            
             var projectedActivities = query
                .ProjectTo<UserActivityDto>(mapper.ConfigurationProvider); //Definiši šta želiš (samo određena polja).
            var activities = await projectedActivities.ToListAsync(cancellationToken); //Izvuci to iz baze (executaj upit).
            return Result<List<UserActivityDto>>.Success(activities); //Spakuj i vrati (standardizovani odgovor).
    }
}
}
