using System;
using Application.Activities.Commands;
using Application.Activities.DTOs;
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

        return HandleResult(await Mediator.Send(new GetActivityDetails.Query { Id = id })); // Handle result iz base api controller
    }

    [HttpPost]
    public async Task<ActionResult<string>> CreateActivity(CreateActivityDto activityDto) //vraca string (id) a unosimo activity
    {
        return HandleResult ( await Mediator.Send(new CreateActivity.Command { ActivityDto = activityDto }));
    }

    [HttpPut ("{id}") ]
    public async Task<ActionResult> EditActivity (EditActivityDto activity) //vraca action result tj nista ne vraca, a unosimo activity
    {
        return HandleResult ( await Mediator.Send(new EditActivity.Command{ ActivityDto = activity }));
    }

    [HttpDelete("{id}")]
     public async Task<ActionResult> DeleteActivity (string id)
    {
        return HandleResult ( await Mediator.Send(new DeleteActivity.Command{Id= id }));
 
    }


}
