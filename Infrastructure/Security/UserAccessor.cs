using System;
using System.Security.Claims;
using Application.Interfaces;
using Domain;
using Microsoft.AspNetCore.Http;
using Persistence;

namespace Infrastructure.Security;
//IHttpContextAccessor: Služi za pristup trenutnom HTTP zahtjevu (npr. tko je poslao zahtjev, koji su headeri, tko je autentificiran).
//AppDbContext: Instanca baze podataka (Entity Framework Core) kroz koju se dohvaćaju podaci o korisniku.

public class UserAccessor (IHttpContextAccessor httpContextAccessor, AppDbContext dbContext) : IUserAccessor
{

    public string GetUserId() // dobijamo  ID korisnika iz cookieja
    {
        return httpContextAccessor.HttpContext?.User //pristupa objektu ClaimsPrincipal koji predstavlja autentificiranog korisnika.
        .FindFirstValue(ClaimTypes.NameIdentifier) // trazi id u tom objektu
        ??  throw new Exception("No user found"); //Ako je rezultat null (nema ID-ja), baca se Exception.
    }

    public async Task<User> GetUserAsync() //Dohvaća cijeli objekt User iz baze podataka na temelju ID-ja.
    {
       return await dbContext.Users.FindAsync(GetUserId()) //Entity Framework metoda koja traži korisnika po primarnom ključu
       //Prvo provjerava lokalni cache (tracking), pa tek onda bazu.
                   ?? throw new UnauthorizedAccessException("No user is logged in"); //Ako korisnik s tim ID-jem ne postoji u bazi (npr. obrisan je, a token je još validan), baca se UnauthorizedAccessException.
    }
}

