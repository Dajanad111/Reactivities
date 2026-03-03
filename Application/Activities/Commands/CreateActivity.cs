using System;
using Application.Activities.DTOs;
using Application.Core;
using Application.Interfaces;
using AutoMapper;
using Domain;
using FluentValidation;
using MediatR;
using Persistence;

namespace Application.Activities.Commands;

public class CreateActivity
{
    public class Command : IRequest<Result<string>> //sad je clasa command i vraca nam string
    {
        public required CreateActivityDto ActivityDto { get; set; } //novi parametar tipa activitydto (ono sto korisnik unosi) koji prosledjujemo tj unosimo 
    }

    public class Handler(AppDbContext context, IMapper mapper, IUserAccessor userAccessor)
     : IRequestHandler<Command, Result<string>>
    {
        public async Task<Result<string>> Handle (Command request, CancellationToken cancellationToken)
        {
            var user = await userAccessor.GetUserAsync();  //dobijamo trenutnog usera preko IUserAccessora

            var activity = mapper.Map<Activity>(request.ActivityDto);   // pravimo novi tip activity i prosledjujemo mu sve iz activitydto

            context.Activities.Add(activity); //dodajemo activity  u context.Activities tj u bazu iz AppDbContext
            //ne treba add async osim kad trazimo neku vrijednost iz database
            
            var attendee = new ActivityAttendee //pravimo novog Attendee za tu aktivnost
            {
                ActivityId = activity.Id, //proslijedimo id
                UserId = user.Id,
                IsHost = true //jer je taj user napravio activity
            };
            activity.Attendees.Add(attendee); //dodamo preko activity novi attendee u tabelu attendees
        

             var result = await context.SaveChangesAsync(cancellationToken) > 0; //savechangesasyc vraca broj zapisanih stanja 

            if (!result) return Result<string>.Failure("Failed to create the activity ", 400);  //ako je result 0 znaci da se nista nije zapisalo, vrati gresku 
            return Result<string>.Success(activity.Id); 
        }
    }
}
