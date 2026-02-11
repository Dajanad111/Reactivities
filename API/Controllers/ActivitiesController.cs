using System;
using Application.Activities.Commands;
using Application.Activities.Queries;
using Domain;
using MediatR;
using Microsoft.AspNetCore.Http.Connections;
using Microsoft.AspNetCore.Mvc;


namespace API.Controllers;

public class ActivitiesController : BaseApiController
{
    [HttpGet]
    public async Task<ActionResult<List<Activity>>> GetActivities() //vraca listu activity, ne unosimo nista
    {
        return await Mediator.Send(new GetActivityList.Query());
    }

    [HttpGet("{id}")]
    public async Task<ActionResult<Activity>> GetActivityDetail(string id) //vraca activity a unosimo id
    {
        return await Mediator.Send(new GetActivityDetails.Query { Id = id }); 
    }

    [HttpPost]
    public async Task<ActionResult<string>> CreateActivity(Activity activity) //vraca string (id) a unosimo activity
    {
        return await Mediator.Send(new CreateActivity.Command { Activity = activity });
    }

    [HttpPut]
    public async Task<ActionResult> EditActivity (Activity activity) //vraca action result tj nista ne vraca, a unosimo activity
    {
        await Mediator.Send(new EditActivity.Command{ Activity = activity });
        return NoContent(); //me vraca nista
    }

    [HttpDelete("{id}")]
     public async Task<ActionResult> DeleteActivity (string id)
    {
        await Mediator.Send(new DeleteActivity.Command{Id= id });
        return Ok();
    }


}
