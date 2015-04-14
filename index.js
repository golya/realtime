var app = require('express')();
var path = require('path');
var http = require('http').Server(app);
var io = require('socket.io')(http);

var clients = [];


app.get('/', function(req, res){
    res.sendFile(path.join(__dirname, './', 'index.html'));
});

io.on('connection', function(socket){

    console.info('New client connected (id=' + socket.id + ').');
    console.log('connect');
    clients.push(socket);
    socket.on('chat message', function(msg){
        console.log('message: ' + msg + ' id: ' + socket.id);
        console.log(clients);
    });

    // When socket disconnects, remove it from the list:
    socket.on('disconnect', function() {
        var index = clients.indexOf(socket);
        if (index != -1) {
            clients.splice(index, 1);
            console.info('Client gone (id=' + socket.id + ').');
        }
    });

});


http.listen(3000, function(){
    console.log('listening on *:3000');
});