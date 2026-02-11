
using System;
using Domain;
using MediatR;
using Microsoft.EntityFrameworkCore;
using Persistence;

namespace Application.Activities.Queries;

public class GetActivityList
{
    //IRequest je interface iz Mediatr.U ovom slucaju vraca <List<Activity> i nema argumente
    public class Query : IRequest<List<Activity>> {}
    
    //uzimamo podatke iz AppDbContext i zovemo ih context
        public class Handler (AppDbContext context) : IRequestHandler<Query, List<Activity>>
    {
        public async Task<List<Activity>> Handle(Query request, CancellationToken cancellationToken)
        {
            return await context.Activities.ToListAsync(cancellationToken);  // ToListAsync vraca activities kao listu
        }
    }

}

