using System;
using Domain;
using AutoMapper;
using MediatR;
using Persistence;

namespace Application.Activities.Commands;

public class EditActivity
{
    public class Command : IRequest //ne vracamo nista
    {
        public required Activity Activity { get; set; } //unosimo activity
    }
//automapper dodat u nuget u application.csproj
    public class Handler(AppDbContext context, IMapper mapper) : IRequestHandler<Command>  //dodajemo Imapper iz mappingProfiles iz fajla core
    {
        public async Task Handle(Command request, CancellationToken cancellationToken)
        {
            var activity = await context.Activities
            .FindAsync([request.Activity.Id], cancellationToken) //prvo pronadjemo po id activity 
            ?? throw new Exception("Cannot find activity"); //izuzetak
            mapper.Map(request.Activity, activity); //povezuje sve properties iz requesta sa originalnim iz activity (activity.title=request.Activity.title)
            await context.SaveChangesAsync(cancellationToken); //cuvamo promjene 
        }
    }
}
