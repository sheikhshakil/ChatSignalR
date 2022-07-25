"use strict";

var connection = new signalR.HubConnectionBuilder().withUrl("/chatHub").build();

var groupBox = document.getElementById("groupBox");
var joinBtn = document.getElementById("joinBtn");
var messageBox = document.getElementById("messageBox");
var sendBtn = document.getElementById("sendBtn");
var unameInput = document.getElementById("uname");
var msgInput = document.getElementById("msg");
var grpInput = document.getElementById("grp");

groupBox.disabled = true;

connection.start()
    .then(function () {
        groupBox.disabled = false;
        messageBox.disabled = true;
    })
    .catch(function (err) {
        return console.error(err.toString());
    });

joinBtn.addEventListener("click", (e) => {
    e.preventDefault();

    connection.invoke("JoinGroup", grpInput.value).catch((err) => {
        return console.log(err.toString());
    });
})

sendBtn.addEventListener("click", function (event) {
    var user = unameInput.value;
    var message = msgInput.value;

    connection.invoke("SendMessage", user, message).catch(function (err) {
        return console.error(err.toString());
    });

    event.preventDefault();
});

connection.on("GroupJoinResult", function (client, group) {
    groupBox.disabled = true;
    messageBox.disabled = false;

    $(`#${group}`).append(`<li><small><i>Client <b>${client}</b> has joined ${group}</i></small></li>`);
});

connection.on("ReceiveMessage", function (user, message, group) {
    $(`#${group}`).append(`<li><b>${user.toUpperCase()} :</b> ${message}</li>`);
});