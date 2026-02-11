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
    }
}
