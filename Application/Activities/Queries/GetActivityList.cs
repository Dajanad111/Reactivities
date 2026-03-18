
using System;
using System.Runtime;
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

public class GetActivityList{

    public class Query : IRequest<Result<PagedList<ActivityDto, DateTime?>>>
    {
      public required ActivityParams Params{ get; set; } //uvodimo sve parametre za skrolanje i filtriranje 
    }

    //uzimamo podatke iz AppDbContext i zovemo ih context
    public class Handler(AppDbContext context, IMapper mapper, IUserAccessor userAccessor) :
    IRequestHandler<Query, Result<PagedList<ActivityDto, DateTime?>>>
    {
        public async Task<Result<PagedList<ActivityDto, DateTime?>>> Handle(Query request, CancellationToken cancellationToken)
        {

            var query = context.Activities
              .OrderBy(x => x.Date) // Poredaj po datumu (najstarije prvo)
              .Where(x => x.Date >= (request.Params.Cursor?? request.Params.StartDate)) //Prikaži mi sve aktivnosti čiji je datum VEĆI ILI JEDNAK: od cursrora ili stardate
              .AsQueryable();   //  Pripremi za daljnje filtriranje

               if (!string.IsNullOrEmpty(request.Params.Filter))
            {
                query = request.Params.Filter switch
                {
                    "isGoing" => query.Where(x => x.Attendees.Any(a => a.UserId == userAccessor.GetUserId())),
                    "isHost" => query.Where(x => x.Attendees.Any(a => a.IsHost && a.UserId == userAccessor.GetUserId())),
                    _ => query //default
                };
            }

               var projectedActivities = query.ProjectTo<ActivityDto>(
                mapper.ConfigurationProvider,
                    new { currentUserId = userAccessor.GetUserId() });// AutoMapper automatski pravi DTO-e i ubacuje currentUserId za personalizaciju


            //Uzmi podatke + pretvori u DTO
            var activities = await projectedActivities
            .Take(request.Params.PageSize + 1) // 🎯 Uzmi 1 više da provjerimo ima li još
            .ToListAsync(cancellationToken);  

            //Odredi da li ima "sljedeća stranica"
            DateTime? nextCursor = null; // 1. Pretpostavka: Nema sljedeće stranice (null)
            if (activities.Count > request.Params.PageSize) // 2. Provjera: Da li smo dobili VIŠE stavki nego što smo postavili na max
            {
                nextCursor = activities.Last().Date;  // 3. Ako jeste: Uzmi datum ZADNJE stavke
                activities.RemoveAt(activities.Count - 1); // 4. Obriši tu zadnju (viška) stavku iz liste
                //nakon ovoga se pokaze samo broj aktivnosti koji je dozvoljen a nextcursor je prva sledeca aktivnost
            } 

            return Result<PagedList<ActivityDto, DateTime?>>.Success(
                new PagedList<ActivityDto, DateTime?>
                {
                        Items = activities,      //  Lista aktivnosti (ono što prikazujemo)
                        NextCursor = nextCursor  //  Oznaka za sljedeću stranicu (ili null ako je kraj)
                });
        }
    }

}

