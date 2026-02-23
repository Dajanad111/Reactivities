using System;
using Application.Core;
using Domain;
using MediatR;
using Persistence;

namespace Application.Activities.Queries;

public class GetActivityDetails
{
    public class Query : IRequest<Result<Activity>> //vraca nam jedan activity iz result.cs
    {
        public required string Id { get; set; } //property id da bi pronasli odredjenu activity
    }

    public class Handler(AppDbContext context) : IRequestHandler<Query, Result<Activity>>
    {
        public async Task<Result<Activity>> Handle(Query request, CancellationToken cancellationToken)//imamo query request
        {
            var activity = await context.Activities.FindAsync([request.Id], cancellationToken); //FindAsync pronalazi id iz query request u activities i vraca odredjenu activity
               
            if(activity==null) 
                  return Result<Activity>.Failure ("Activity not found", 404); //result.cs parametri u slucaju failure

            return Result<Activity>.Success(activity); //result.cs  u slucaju success
        }
    }
}
