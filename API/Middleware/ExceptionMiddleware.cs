using System;
using System.Net;
using System.Text.Json;
using Application.Core;
using FluentValidation;
using Microsoft.AspNetCore.Mvc;

namespace API.Middleware;

public class ExceptionMiddleware(IHostEnvironment env, ILogger<ExceptionMiddleware> logger) : IMiddleware 
// env → da znamo da li smo u razvoju ili produkciji
// logger → da beležimo greške u log fajl
{
    public async Task InvokeAsync(HttpContext context, RequestDelegate next) //  context = informacije o trenutnom zahtevu (URL, headeri...)
    //  next = "pozovi sledeći u nizu" (controller, handler...)
    {
        try //Pusti zahtev da ide dalje kroz aplikaciju"
        {
            await next(context);  //    Ako sve prođe OK → nastavi normalno
        }
        catch (ValidationException ex) //  Greška validacije (korisnik unio pogrešno)
        {
            await HandleValidationException(context, ex);  //  Poseban tretman za validacione greške (400 Bad Request)
        }
        catch (Exception ex) //  BILO KOJA DRUGA greška (baza, null reference...)
        {
            await HandleException(context, ex);   // Generalni tretman za sistemske greške (500 Server Error)
        }
    }


 // METODA 1: Rukovanje SISTEMSKIM greškama (500) 
    private async Task HandleException(HttpContext context, Exception ex)
    {
        logger.LogError(ex, ex.Message);   // Zapiši grešku u log (da developer može da vidi šta se desilo)
        context.Response.ContentType = "application/json";    //  Podesi HTTP odgovor da bude JSON
        context.Response.StatusCode = (int)HttpStatusCode.InternalServerError;  // Postavi status kod na 500 (Internal Server Error)
 
        var response = env.IsDevelopment()  //  Da li smo u development mode? env.IsDevelopment() je iz Šta koristimo IHostEnvironment
            ? new AppException(context.Response.StatusCode, ex.Message, ex.StackTrace?.ToString()) //  DA (razvoj): Prikaži SVE detalje da developer može da popravi bug
            : new AppException(context.Response.StatusCode, "Internal Server Error", null);   //  NE (produkcija): Prikaži samo opštu poruku (bezbednost!)

        var options = new JsonSerializerOptions { PropertyNamingPolicy = JsonNamingPolicy.CamelCase };   // Podesi da JSON koristi camelCase (npr. "statusCode" umesto "StatusCode")

        var json = JsonSerializer.Serialize(response, options);  //  Pretvori AppException objekat u JSON tekst

        await context.Response.WriteAsync(json);  //  Pošalji JSON tekst kao odgovor klijentu (frontend-u)
    }

    private static async Task HandleValidationException(HttpContext context, ValidationException ex)
    {
        var validationErrors = new Dictionary<string, string[]>(); //  Kreiraj prazan rečnik za čuvanje grešaka po poljima
        //    Primer: { "title": ["Title is required"], "date": ["Date must be future"] }

        if (ex.Errors is not null)  // Da li uopšte ima grešaka? //ex.Errors nam daje FluentValidation biblioteka 
        {
            foreach (var error in ex.Errors) //Prođi kroz SVAKU grešku koju je validator vratio
            {
                if (validationErrors.TryGetValue(error.PropertyName, out var existingErrors)) // Da li već imamo grešku za ovo polje? (npr. Title ima 2 greške)
                {
                    validationErrors[error.PropertyName] = [.. existingErrors, error.ErrorMessage];// ✅ DA → Dodaj novu grešku u postojeću listu
                }
                else
                {
                    validationErrors[error.PropertyName] = [error.ErrorMessage];      //  NE → Kreiraj novu listu sa prvom greškom
                }
            }
        }

        context.Response.StatusCode = StatusCodes.Status400BadRequest;    // Postavi HTTP status kod na 400 (Bad Request)

        var validationProblemDetails = new ValidationProblemDetails(validationErrors) //  Kreiraj standardni ASP.NET objekat za validacione greške
        {
            Status = StatusCodes.Status400BadRequest,
            Type = "ValidationFailure",
            Title = "Validation error",
            Detail = "One or more validation errors has occurred"
        };

        await context.Response.WriteAsJsonAsync(validationProblemDetails);   // Pošalji ovaj objekat kao JSON odgovor (WriteAsJsonAsync radi serialize + send)
    }
}