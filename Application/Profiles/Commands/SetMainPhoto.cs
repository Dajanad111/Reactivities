using System;

using Application.Core;
using Application.Interfaces;
using MediatR;
using Persistence;

namespace Application.Profiles.Commands;

public class SetMainPhoto
{
    public class Command : IRequest<Result<Unit>>
    {
        public required string Id { get; set; }
    }

    public class Handler(AppDbContext context, IUserAccessor userAccessor) : IRequestHandler<Command, Result<Unit>>
    {
        public async Task<Result<Unit>> Handle(Command request, CancellationToken cancellationToken)
        {
            var user = await userAccessor.GetUserWithPhotosAsync();  //ucitavamo usera sa svim slikama 

            var photo = user.Photos.FirstOrDefault(x => x.Id == request.Id); // ucitavamo selektovanu sliku 
            if (photo == null) return Result<Unit>.Failure("Cannot find photo", 400);

            user.ImageUrl = photo.Url;  //user image url ce biti selektovana slika 

            var result = await context.SaveChangesAsync(cancellationToken) > 0;

            return result
                ? Result<Unit>.Success(Unit.Value)
                : Result<Unit>.Failure("Problem setting main photo", 400);
        }
    }
}