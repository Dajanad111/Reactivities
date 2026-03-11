using System;
using Application.Core;
using Application.Interfaces;
using MediatR;
using Microsoft.EntityFrameworkCore;
using Persistence;

namespace Application.Profiles.Commands;

public class EditProfile  //podaci stizu do profilescontroller i on ih proslijedi odje 
{
    public class Command : IRequest<Result<Unit>>//ovdje se unose podaci od korisnika i onda idu na validaciju u editprofilevalidator
    {
        public string DisplayName { get; set; } = string.Empty; // Novo ime koje korisnik želi da ima (Display Name)
        // = string.Empty znači da ako ništa ne pošalje, biće prazan tekst, a ne null
        public string Bio { get; set; } = string.Empty;
    }
    //kada prodju validaciju ide handler, gdje se podaci azuriraju 
    public class Handler(AppDbContext context, IUserAccessor userAccessor)  // On prima 'context' (vezu sa bazom) i 'userAccessor' (ko je ulogovan)
	    : IRequestHandler<Command, Result<Unit>>  //  Result<Unit> jer ne vraca nista
    {
        public async Task<Result<Unit>> Handle(Command request, 
	        CancellationToken cancellationToken)
        {
            var user = await userAccessor.GetUserAsync();  // 1. Saznajemo ko je trenutno ulogovan korisnik

            user.DisplayName = request.DisplayName;   // 2. Uzimamo podatke iz zahteva (request) i upisujemo ih u objekat korisnika
            user.Bio = request.Bio;
 
            context.Entry(user).State = EntityState.Modified;   // 3. Obaveštavamo bazu podataka da se ovaj korisnik PROMENIO

            var result = await context.SaveChangesAsync(cancellationToken) > 0; // 4. Šaljemo komandu bazi da stvarno sačuva promene (SaveChanges)
            // Ako je broj sačuvanih redova veći od 0, znači da je uspelo (result = true)
            return result
                ? Result<Unit>.Success(Unit.Value)
                : Result<Unit>.Failure("Failed to update profile", 400);   // Ako nije uspelo, vraćamo grešku sa porukom i kodom 400
        }
    }
}
