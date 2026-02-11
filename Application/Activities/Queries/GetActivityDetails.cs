using System;
using Domain;
using MediatR;
using Persistence;

namespace Application.Activities.Queries;

public class GetActivityDetails
{
    public class Query : IRequest<Activity> //vraca nam jedan activity
    {
        public required string Id { get; set; } //property id da bi pronasli odredjenu activity
    }

    public class Handler(AppDbContext context) : IRequestHandler<Query, Activity>
    {
        public async Task<Activity> Handle(Query request, CancellationToken cancellationToken)//imamo query request
        {
            var activity = await context.Activities.FindAsync([request.Id], cancellationToken) //FindAsync pronalazi id iz query request u activities i vraca odredjenu activity
                    ?? throw new Exception("Activity not found"); // ovo je izuzetak ako ne pronadje id tj ako je activity==null

            return activity;
        }
    }
}
