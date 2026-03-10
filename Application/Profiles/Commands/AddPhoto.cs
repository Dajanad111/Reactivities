using System;
using Application.Core;
using Application.Interfaces;
using Domain;
using MediatR;
using Microsoft.AspNetCore.Http;
using Persistence;

namespace Application.Profiles.Commands;

public class AddPhoto
{
    public class Command : IRequest<Result<Photo>>
    {
        public required IFormFile File { get; set; }
    }

    public class Handler(IUserAccessor userAccessor, AppDbContext context,
        IPhotoService photoService) : IRequestHandler<Command, Result<Photo>>
    {
        public async Task<Result<Photo>> Handle(Command request, CancellationToken cancellationToken)
        {
            var uploadResult = await photoService.UploadPhoto(request.File);  //uploadujemo sliku

            if (uploadResult == null) return Result<Photo>.Failure("Failed to upload photo", 400);

            var user = await userAccessor.GetUserAsync(); //ucitavamo usera

            var photo = new Photo   //pravimo photo objekat
            {
                Url = uploadResult.Url,
                PublicId = uploadResult.PublicId,
                UserId = user.Id
            };

            user.ImageUrl ??= photo.Url;  //ako imageurl =0 onda se radi ovo sto je desno tj ImageUrl = photo.Url

            context.Photos.Add(photo);  //dodajemo u database

            var result = await context.SaveChangesAsync(cancellationToken) > 0;

            return result
                ? Result<Photo>.Success(photo)
                : Result<Photo>.Failure("Problem adding photo", 400);
        }
    }
}