using System;
using FluentValidation;
using MediatR;

namespace Application.Core;

// Ova klasa je "Pipeline Behavior". To znači da se izvršava 
// AUTOMATSKI prije ili poslije glavnog rukovatelja (Handlera) zahtjeva.
// Koristi se za cross-cutting concerns (poput validacije, logiranja, transakcija).
//tj provjerava sta korisnik unese i baca ValidationException ako nije okej
public class ValidationBehavior<TRequest, TResponse>(IValidator<TRequest>? validator = null) 
    : IPipelineBehavior<TRequest, TResponse> where TRequest : notnull
{
 public async Task<TResponse> Handle(TRequest request,     // Glavna metoda pipelinea. MediatR će pozvati ovu metodu prije nego što dođe do stvarnog Handlera.
 RequestHandlerDelegate<TResponse> next, CancellationToken cancellationToken) 
    {
        if (validator == null) return await next(); // 1. Provjera postoji li validator za ovaj tip zahtjeva.
        // Ako nema validatora (null), preskačemo validaciju i odmah nastavljamo dalje.
        
        var validationResult = await validator.ValidateAsync(request, cancellationToken); // 2. Pokrećemo asinkronu validaciju podataka iz 'request' objekta.
        // 'cancellationToken' omogućuje prekid operacije ako je potrebno.

        if (!validationResult.IsValid) // 3. Provjeravamo da li je validacija uspješna.
        { 
            throw new ValidationException(validationResult.Errors);  // Ako nije uspješna, bacamo izuzetak sa listom grešaka.400 Bad Request  
        }

        return await next();// 4. Ako je sve u redu, nastavljamo lanac izvršavanja.
    }
}
