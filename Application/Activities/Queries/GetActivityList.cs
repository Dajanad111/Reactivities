
using System;
using Application.Activities.DTOs;
using AutoMapper;
using AutoMapper.QueryableExtensions;
using Domain;
using MediatR;
using Microsoft.EntityFrameworkCore;
using Persistence;

namespace Application.Activities.Queries;

public class GetActivityList
{
    //IRequest je interface iz Mediatr.U ovom slucaju vraca <List<Activity> i nema argumente
    public class Query : IRequest<List<ActivityDto>> {}
    
    //uzimamo podatke iz AppDbContext i zovemo ih context
        public class Handler (AppDbContext context, IMapper mapper) : IRequestHandler<Query, List<ActivityDto>>
    {
        public async Task<List<ActivityDto>> Handle(Query request, CancellationToken cancellationToken)
        {
            return await context.Activities
            .ProjectTo<ActivityDto>(mapper.ConfigurationProvider)
            .ToListAsync(cancellationToken);  // ToListAsync vraca activities kao listu
        }
    }

}

