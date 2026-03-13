using System;
using Application.Core;
using Application.Interfaces;
using Domain;
using MediatR;
using Persistence;

namespace Application.Profiles.Commands;

public class FollowToggle
{
    public class Command : IRequest<Result<Unit>>
    {
        public required string TargetUserId { get; set; }
    }

    public class Handler(AppDbContext context, IUserAccessor userAccessor) : IRequestHandler<Command, Result<Unit>>
    {
        public async Task<Result<Unit>> Handle(Command request, CancellationToken cancellationToken)
        {
            var observer = await userAccessor.GetUserAsync(); // trenutni user 
            var target = await context.Users.FindAsync([request.TargetUserId], //pronalazimo trazenog usera da bi ga zapratili
                cancellationToken);

            if (target == null)
                return Result<Unit>.Failure("Target user not found", 400);

            var following = await context.UserFollowings  //pretrazujemo userFollowings da vidimo 
                .FindAsync([observer.Id, target.Id], cancellationToken); //da li vec pratimo ovog usera

            if (following == null) //ako ne pratimo 
                context.UserFollowings.Add(new UserFollowing { ObserverId = observer.Id, TargetId = target.Id }); //onda dodajemo novog userfollowing tj zapracujemo ga
            else
                context.UserFollowings.Remove(following); // otpracujemo ga, tj uklanjamo tog userFollowinga

            return await context.SaveChangesAsync(cancellationToken) > 0
                ? Result<Unit>.Success(Unit.Value)
                : Result<Unit>.Failure("Problem updating following", 400);
        }
    }
}