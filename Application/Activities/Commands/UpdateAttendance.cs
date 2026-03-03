using System;
using Application.Core;
using Application.Interfaces;
using Domain;
using MediatR;
using Microsoft.EntityFrameworkCore;
using Persistence;

namespace Application.Activities.Commands;

public class UpdateAttendance
{
    public class Command : IRequest<Result<Unit>> //unit jer ne moramo nista da vratimo 
    {
        public required string Id { get; set; }
    }

    public class Handler(IUserAccessor userAccessor, AppDbContext context) 
    : IRequestHandler<Command, Result<Unit>>
    {
        public async Task<Result<Unit>> Handle(Command request, CancellationToken cancellationToken)
        {
            var activity = await context.Activities
                .Include(x => x.Attendees) //Kada učitavaš Activity, odmah učitaj i sve povezane Attendees iz baze
                .ThenInclude(x => x.User) //Za svakog Attendeea kojeg si upravo učito, učitaj i njegovog User-a
                .SingleOrDefaultAsync(x => x.Id == request.Id, cancellationToken); //traži tačno jedan activity tj zapis u bazi podataka na osnovu ID-ja.

            if (activity == null) return Result<Unit>.Failure("Activity not found", 404);

            var user = await userAccessor.GetUserAsync();

            var attendance = activity.Attendees.FirstOrDefault(x => x.UserId == user.Id);
            var isHost = activity.Attendees.Any(x => x.IsHost && x.UserId == user.Id);

            if (attendance != null) //ako imamo attendance
            { //sta se desava kada canceluju 
                if (isHost) activity.IsCancelled = !activity.IsCancelled; //ako je host u pitanju, onda canceluje activity, ili je popnovo aktivira u zavisnosti sta je trenutno aktivno
                else activity.Attendees.Remove(attendance); //ako nije host, uklanjamo ga sa attendance iz ove activity
            }
            else
            {
                activity.Attendees.Add(new ActivityAttendee //pravi novi attendee
                {
                    UserId = user.Id,
                    ActivityId = activity.Id,
                    IsHost = false
                });
            }

            var result = await context.SaveChangesAsync(cancellationToken) > 0;

            return result
                ? Result<Unit>.Success(Unit.Value)
                : Result<Unit>.Failure("Problem updating attendance", 400);
        }
    }
}