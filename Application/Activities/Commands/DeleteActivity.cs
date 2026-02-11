using System;
using System.Security.Cryptography;
using MediatR;
using Persistence;
using Domain;

namespace Application.Activities.Commands;

public class DeleteActivity
{
    public class Command : IRequest //ne vraca nista
    {
        public required string Id { get; set; } //saljemo id activity koju brisemo
    }
    public class Handler(AppDbContext context) : IRequestHandler<Command> 
    {
        public async Task Handle(Command request, CancellationToken cancellationToken)
        {
            var activity = await context.Activities.FindAsync([request.Id], cancellationToken)
            ?? throw new Exception("Cannot find activity");

            context.Remove(activity); //brisanje activity
            await context.SaveChangesAsync(cancellationToken);
        }
    }

}
