using Application.Core;
using Application.Interfaces;
using Application.Profiles.DTOs;
using AutoMapper;
using AutoMapper.QueryableExtensions;
using MediatR;
using Microsoft.EntityFrameworkCore;
using Persistence;

namespace Application.Profiles.Queries;

public class GetFollowings
{
    public class Query : IRequest<Result<List<UserProfile>>>
    {
        public string Predicate { get; set; } = "followers"; //da biraju da li je followers ili following
        public required string UserId { get; set; }
    }

    public class Handler(AppDbContext context, IMapper mapper, IUserAccessor userAccessor) : IRequestHandler<Query, Result<List<UserProfile>>>
    {
        public async Task<Result<List<UserProfile>>> Handle(Query request, CancellationToken cancellationToken)
        {
            var profiles = new List<UserProfile>(); // Pravimo praznu listu koja će čuvati profile korisnika koje ćemo vratiti

            switch (request.Predicate)
            {
                case "followers":    // SLUČAJ 1: Tražimo "followers" - KO PRATI ovog korisnika?
                    profiles = await context.UserFollowings.Where(x => x.Target.Id == request.UserId) //nađi sve zapise gde je target (praćeni) = traženi user
                        .Select(x => x.Observer) // Uzimamo SAMO onoga ko prati (Observer), jer to su nam pratioci!
                        .ProjectTo<UserProfile> // Pretvaramo User entitet u UserProfile DTO (skrivena polja, dodatni podaci)
                        (mapper.ConfigurationProvider,   // "Kada vidiš User, pretvori ga u UserProfile OVAKO..."
                            new { currentUserId = userAccessor.GetUserId() }) //Ova linija uzima ID trenutno ulogovanog korisnika i šalje ga AutoMapperu da bi znao ko gleda podatke.
                            //tj salje ga u mappingprofiles
                        .ToListAsync(cancellationToken);    // Izvršavamo upit i čekamo rezultate iz baze (asinhrono)
                    break;
                case "followings":// SLUČAJ 2: Tražimo "followings" - KOGA PRATI ovaj korisnik?
                    profiles = await context.UserFollowings.Where(x => x.Observer.Id == request.UserId) // Filtriramo: nađi sve zapise gde je observer (pratilac) = traženi user
                        .Select(x => x.Target) //  Uzimamo SAMO onoga koga prati (Target),
                        .ProjectTo<UserProfile>(mapper.ConfigurationProvider, 
                            new { currentUserId = userAccessor.GetUserId() })
                        .ToListAsync(cancellationToken);
                    break;
            }

            return Result<List<UserProfile>>.Success(profiles);    // Pakujemo rezultate u Result objekat i vraćamo pozivaocu
        }
    }
}