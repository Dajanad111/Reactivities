using Application.Core;
using Application.Interfaces;
using Application.Profiles.DTOs;
using AutoMapper;
using AutoMapper.QueryableExtensions;
using MediatR;
using Microsoft.EntityFrameworkCore;
using Persistence;

namespace Application.Profiles.Queries;

public class GetProfile
{
    public class Query : IRequest<Result<UserProfile>>
    {
        public required string Id { get; set; } // ID korisnika koga tražimo (required = mora se postaviti)
    }

    public class Handler(AppDbContext context, IMapper mapper, IUserAccessor userAccessor) : IRequestHandler<Query, Result<UserProfile>>
    {
        public async Task<Result<UserProfile>> Handle(Query request, CancellationToken cancellationToken)
        {
            var profile = await context.Users  // 1. Pristupamo Users tabeli u bazi
                .ProjectTo<UserProfile>(mapper.ConfigurationProvider, //bira SAMO potrebne kolone za UserProfile
                  new { currentUserId = userAccessor.GetUserId() })
                 .SingleOrDefaultAsync(x => x.Id == request.Id, cancellationToken); //izvršava SQL sa WHERE x.Id == request.Id i vraća prvi rezultat ili null

            return profile == null 
                ? Result<UserProfile>.Failure("Profile not found", 400) // Ako nema rezultata → greška 400
                : Result<UserProfile>.Success(profile); // Ako ima → vraća profil kao uspešan odgovor
        }
    }
}