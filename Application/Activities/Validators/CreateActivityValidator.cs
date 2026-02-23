using System;
using Application.Activities.Commands;
using Application.Activities.DTOs;
using FluentValidation;

namespace Application.Activities.Validators;

public sealed class CreateActivityValidator : BaseActivityValidator<CreateActivity.Command, CreateActivityDto> //validiraj CreateActivityDto koji se nalazi u CreateActivity.Command
{
    public CreateActivityValidator() : base(x => x.ActivityDto)
    {
        
    }
}