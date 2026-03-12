using System;
using Application.Activities.DTOs;
using Application.Core;
using Application.Interfaces;
using AutoMapper;
using Domain;
using MediatR;
using Microsoft.EntityFrameworkCore;
using Persistence;

namespace Application.Activities.Commands;

public class AddComment
{
public class Command : IRequest<Result<CommentDto>>
    {
         public required string Body { get; set; }  
        public required string ActivityId { get; set; }
    }

    public class Handler(AppDbContext context, IMapper mapper, IUserAccessor userAccessor)  // On prima 'context' (vezu sa bazom) i 'userAccessor' (ko je ulogovan)
      : IRequestHandler<Command, Result<CommentDto>>
    {
        public async Task<Result<CommentDto>> Handle(Command request, CancellationToken cancellationToken)
        {

              var activity = await context.Activities //ucitavamo prvo activity
                .Include(x => x.Comments) //dodaj i sve koemntare do sad
                .ThenInclude(x => x.User) //ucitaj i usera
                .FirstOrDefaultAsync(x => x.Id == request.ActivityId, cancellationToken); //gdje je id kao id iz requesta


            if (activity == null) return Result<CommentDto>.Failure("Could not find activity", 400);

            var user = await userAccessor.GetUserAsync();

            var comment = new Comment
            {
                UserId = user.Id,
                ActivityId = activity.Id,
                Body = request.Body
            };

            activity.Comments.Add(comment); //fodamo koemntar u activity
            var result = await context.SaveChangesAsync(cancellationToken) > 0; 
            return result
                ? Result<CommentDto>.Success(mapper.Map<CommentDto>(comment)) //vracamo novi dto i punimo ga informacijama iz comment koji smo napravil 
                : Result<CommentDto>.Failure("Failed to add comment", 400);

        }
    }
}
