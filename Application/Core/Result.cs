using System;

namespace Application.Core;

public class Result<T> //Generički tip <T> omogućava da ova klasa vrati bilo šta – od broja do kompleksnog objekta – uz informaciju o statusu operacije.
{
    public bool IsSuccess { get; set; }  // Flag koji govori da li je operacija prošla uspješno.
    public T? Value { get; set; }  // Stvarni podatak koji vraćamo ako je operacija uspješna.
    // '?' znači da može biti null (npr. ako operacija nije uspjela, nema vrijednosti).
    public string? Error { get; set; } // Poruka o grešci ako operacija nije uspjela.
    public int Code { get; set; } // Kod greške (često se koristi za HTTP status kodove, npr. 404, 500).

    public static Result<T> Success(T value) => new() { IsSuccess = true, Value = value}; // Pomoćna statička metoda za kreiranje uspješnog rezultata.
    // Umjesto 'new Result<T> { IsSuccess = true... }', pišeš samo 'Result<T>.Success(data)'.
    public static Result<T> Failure(string error, int code) => new()// Pomoćna statička metoda za kreiranje neuspješnog rezultata.
    // Ovdje postavljamo IsSuccess na false, upisujemo grešku i kod statusa.
    {
        IsSuccess = false, 
        Error = error,
        Code = code
    };
}
