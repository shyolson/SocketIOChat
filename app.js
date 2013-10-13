var express = require("express"),
    app = express(),
    server = require("http").createServer(app),
    io = require("socket.io").listen(server),
    users = {};

server.listen(3003);

app.get("/", function(req, res) {
    res.sendfile(__dirname + "/index.html");
});

io.sockets.on("connection", function(socket) {
    socket.on("new user", function(data, callback) {
        if (data in users) {
            callback(false);
        }
        else {
            callback(true);
            socket.nickname = data;
            users[data] = socket;
            updateNicknames();

        }
    });

    function updateNicknames() {
        io.sockets.emit("username", Object.keys(users));
    }

    socket.on("send message", function(data) {
        io.sockets.emit("new message", {
            msg: data,
            nick: socket.nickname
        });
    });

    socket.on("disconnect", function(data) {
        if (!socket.nickname) return;
        delete users(socket.nickname);
        updateNicknames();
    });
});