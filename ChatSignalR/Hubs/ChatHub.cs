using ChatSignalR.Models;
using Microsoft.AspNetCore.SignalR;
using System.Collections.Generic;
using System.Threading.Tasks;

namespace ChatSignalR.Hubs
{
    public class ChatHub : Hub
    {
        private static List<User> Users;
        public async Task JoinGroup(string groups)
        {
            if(Users == null)
            {
                Users = new List<User>();
            }

            User user = new User
            {
                ClientId = Context.ConnectionId,
                JoinedGroups = groups.Split("&")
            };
            Users.Add(user);

            foreach (var group in user.JoinedGroups)
            {
                await Groups.AddToGroupAsync(Context.ConnectionId, group);
                await Clients.Group(group).SendAsync("GroupJoinResult", $"{Context.ConnectionId}", group);
            }
        }
        public async Task SendMessage(string username, string message)
        {
            User user = Users.Find(u => u.ClientId.Equals(Context.ConnectionId));

            foreach (var group in user.JoinedGroups)
            {
                await Clients.Group(group).SendAsync("ReceiveMessage", username, message, group);
            }
        }
    }
}
