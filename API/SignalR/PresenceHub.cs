using System;
using API.Extensions;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.SignalR;

namespace API.SignalR;

[Authorize]
public class PresenceHub(PresenceTracker tracker) : Hub
// public class PresenceHub() : Hub

{
    public override async Task OnConnectedAsync()
    {
        if (Context.User == null) throw new HubException("Cannot get current user claim");
        await tracker.UserConnected(Context.User.GetUsername(), Context.ConnectionId);
        await Clients.Others.SendAsync("UserIsOnline", Context.User?.GetUsername());

        var isOnline = await tracker.UserConnected(Context.User.GetUsername(), Context.ConnectionId);
        if (isOnline) await Clients.Others.SendAsync("UserIsOnline", Context.User?.GetUsername());

        var currentUsers = await tracker.GetOnlineUsers();
        await Clients.Caller.SendAsync("GetOnlineUsers", currentUsers);
    }

    public override async Task OnDisconnectedAsync(Exception? exception)
    {
        if (Context.User == null) throw new HubException("Cannot get current user claim");
        // await tracker.UserDisconnected(Context.User.GetUsername(), Context.ConnectionId);

        // await Clients.Others.SendAsync("UserIsOffline", Context.User?.GetUsername());

        var isOffline = await tracker.UserDisconnected(Context.User.GetUsername(), Context.ConnectionId);
        if (isOffline) await Clients.Others.SendAsync("UserIsOffline", Context.User?.GetUsername());
        // var currentUsers = await tracker.GetOnlineUsers();
        // await Clients.Caller.SendAsync("GetOnlineUsers", currentUsers);
        await base.OnDisconnectedAsync(exception);
    }
}
