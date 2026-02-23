using System;
using System.Security.Cryptography;
using MediatR;
using Persistence;
using Domain;
using Application.Core;

namespace Application.Activities.Commands;

public class DeleteActivity
{
    public class Command : IRequest<Result<Unit>> //vraca result da bi moglo da javi gresku //unit prestavlja void type pa je kao da ne vraca nista
    {
        public required string Id { get; set; } //saljemo id activity koju brisemo
    }
    public class Handler(AppDbContext context) : IRequestHandler<Command, Result<Unit>>
    {
        public async Task<Result<Unit>> Handle(Command request, CancellationToken cancellationToken)
        {
            var activity = await context.Activities.FindAsync([request.Id], cancellationToken);
            if (activity == null) return Result<Unit>.Failure("Activity not found", 404); //result.cs parametri u slucaju failure tj ako ne pronalazi activity

            context.Remove(activity); //brisanje activity
            var result = await context.SaveChangesAsync(cancellationToken) > 0; //savechangesasyc vraca broj zapisanih stanja 
            if (!result) return Result<Unit>.Failure("Failed to delete the activity ", 400);  //ako je result 0 znaci da se nista nije zapisalo, vrati gresku 

            return Result<Unit>.Success(Unit.Value);

        }
    }

}
