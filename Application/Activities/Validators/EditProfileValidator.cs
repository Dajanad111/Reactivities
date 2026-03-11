using System;
using Application.Activities.Commands;
using Application.Profiles.Commands;
using FluentValidation;

namespace Application.Activities.Validators;

public class EditProfileValidator : AbstractValidator<EditProfile.Command>
{// Ovo je čuvar koji proverava da li su podaci ispravni prije nego što stignu do baze
 public EditProfileValidator()
    {
        RuleFor(x => x.DisplayName).NotEmpty();// Pravilo: Polje DisplayName (ime) ne smije  biti prazno
        // Ako je prazno, zahtev će biti odbijen odmah, bez ulaska u bazu
    }
}
