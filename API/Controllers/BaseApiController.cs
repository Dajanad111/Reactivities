using Application.Core;
using MediatR;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;

namespace API.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class BaseApiController : ControllerBase
    {

//definisemo mediator servise da bi mogli da ga koristimo u ActivitiesController
        private IMediator? _mediator;  
//protected znaci da moze da se koristi u ovoj klasi i svakoj koja je nasledjuje
        protected IMediator Mediator => 
        _mediator ??= HttpContext.RequestServices.GetService<IMediator>() //ako je _mediator ==null postavi ga na ovo desno 
            ?? throw new InvalidOperationException("IMediator service is not available."); //ako je i service== null onda  InvalidOperationException
    
     protected ActionResult HandleResult<T>(Result<T> result) // Ova metoda prima Result<T> i vraća ActionResult koji ASP.NET Core šalje kao HTTP odgovor.
    { 
        if (result.IsSuccess && result.Value != null) // 1. PROVJERA USPJEHA: Ako je operacija uspješna I ima vrijednost
            return Ok(result.Value);   // Vraća HTTP 200 OK sa JSON tijelom koji sadrži result.Value

        if (!result.IsSuccess && result.Code == 404)     // 2. PROVJERA ZA 404: Ako operacija nije uspjela I kod greške je 404
            return NotFound();   // Vraća HTTP 404 Not Found (bez tijela, ili sa podrazumijevanom porukom)

        return BadRequest(result.Error);   // 3. SVE OSTALE GREŠKE: Ako nije 200 i nije 404
    } // Vraća HTTP 400 Bad Request sa porukom o grešci u tijelu odgovora


    
    }
}
