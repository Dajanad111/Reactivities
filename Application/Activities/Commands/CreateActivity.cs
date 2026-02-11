using System;
using Domain;
using MediatR;
using Persistence;

namespace Application.Activities.Commands;

public class CreateActivity
{
    public class Command : IRequest<string> //sad je clasa command i vraca nam string
    {
        public required Activity Activity { get; set; } //novi parametar tipa activity koji prosledjujemo tj unosimo 
    }

    public class Handler(AppDbContext context) : IRequestHandler<Command, string>
    {
        public async Task<string> Handle (Command request, CancellationToken cancellationToken)
        {
            context.Activities.Add(request.Activity); //dodajemo nas request Activity, u context.Activities tj u bazu iz AppDbContext
            //ne treba add async osim kad trazimo neku vrijednost iz database
            await context.SaveChangesAsync(cancellationToken); //cuvaj promjene
            return request.Activity.Id; //vrati id
        }
    }
}
