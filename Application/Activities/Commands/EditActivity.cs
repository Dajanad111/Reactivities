using System;
using Domain;
using AutoMapper;
using MediatR;
using Persistence;
using Application.Core;
using Application.Activities.DTOs;

namespace Application.Activities.Commands;

public class EditActivity
{
    public class Command : IRequest<Result<Unit>>//vraca result da bi moglo da javi gresku //unit prestavlja void type pa je kao da ne vraca nista 
    {
        public required EditActivityDto ActivityDto { get; set; } //unosimo activity
    }
    //automapper dodat u nuget u application.csproj
    public class Handler(AppDbContext context, IMapper mapper) : IRequestHandler<Command, Result<Unit>>  //dodajemo Imapper iz mappingProfiles iz fajla core
    {
        public async Task<Result<Unit>> Handle(Command request, CancellationToken cancellationToken)
        {
            var activity = await context.Activities
            .FindAsync([request.ActivityDto.Id], cancellationToken); //prvo pronadjemo po id activity 
            if (activity == null) return Result<Unit>.Failure("Activity not found", 404); //result.cs parametri u slucaju failure tj ako ne pronalazi activity

            mapper.Map(request.ActivityDto, activity); //povezuje sve properties iz requesta sa originalnim iz activity (activity.title=request.Activity.title)

            var result = await context.SaveChangesAsync(cancellationToken) > 0; //savechangesasyc vraca broj zapisanih stanja 
            if (!result) return Result<Unit>.Failure("Failed to update the activity ", 400);  //ako je result 0 znaci da se nista nije zapisalo, vrati gresku 

            return Result<Unit>.Success(Unit.Value);

        }
    }
}
