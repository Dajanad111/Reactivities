using Application.Activities.Commands;
using Application.Activities.Queries;
using MediatR;
using Microsoft.AspNetCore.SignalR;

namespace API.SignalR;

public class CommentHub(IMediator mediator) : Hub
{
    public async Task SendComment(AddComment.Command command)
    {
        var comment = await mediator.Send(command);

        await Clients.Group(command.ActivityId).SendAsync("ReceiveComment", comment.Value); // SIGNALR DiO: Šaljemo komentar SVIMA u grupi (activity)
    //    Clients.Group(...) → targetira sve konekcije u toj grupi
    //    SendAsync("ReceiveComment", ...) → zove klijentsku funkciju "ReceiveComment"
    }

    public override async Task OnConnectedAsync()  // SignalR: override metode koja se automatski poziva kada se klijent poveže
    {
        var httpContext = Context.GetHttpContext(); // SignalR: Context daje informacije o trenutnoj konekciji
        var activityId = httpContext?.Request.Query["activityId"];  //dobijami id trenutne activity iz URL-a konekcije

        if (string.IsNullOrEmpty(activityId)) throw new HubException("No activity with this id"); // SignalR exception

        await Groups.AddToGroupAsync(Context.ConnectionId, activityId!); // SIGNALR : Dodajemo konekciju u "grupu" po activityId
    //    Grupa = svi korisnici koji gledaju ISTU aktivnost

        var result = await mediator.Send(new GetComments.Query { ActivityId = activityId! });   // MediatR: učitavamo postojeće komentare iz baze

        await Clients.Caller.SendAsync("LoadComments", result.Value);   // SignalR: Šaljemo SAMO ovom klijentu (Caller) listu komentara
    }
}