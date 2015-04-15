var app = require('express')();
var path = require('path');
var http = require('http').Server(app);
var io = require('socket.io')(http);

var clients = {};
var users = {};


app.get('/', function(req, res){
    res.sendFile(path.join(__dirname, './', 'index.html'));
});

io.on('connection', function(socket){

    socket.on('chat message', function(msg){
        toUser = users[clients[socket.id]].partnerid;
        socket.to(users[toUser].id).emit('chat message', msg);
    });

    // When socket disconnects, remove it from the list:
    socket.on('disconnect', function() {

    });

    socket.on('register my account', function (data) {
        clients[socket.id] = data.name;
        users[data.name] = {id: socket.id, partnerid: null};
        console.log(users);
    });

    socket.on('set up my partner', function (partner) {
        users[clients[socket.id]]['partnerid'] = partner;
        console.log(users);
    });

    socket.emit('get your name');

});


http.listen(3000, function(){
    console.log('listening on *:3000');
});