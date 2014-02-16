var net = require('net');
var path = require("path");

var clients = [];

net.createServer(function(socket){

    socket.write("your ip and port: " + socket.remoteAddress + ":" + socket.remotePort + "\n\n");

    clients.push(socket);
    socket.name = 'user' + clients.length;

    socket.write("Welcome " + socket.name + "\r\n");
    socket.text = "";

    broadcast("\r\n\n" + socket.name + " joined the chat\r\n", socket);

    socket.on('data', function(data){

        var txt = data.toString();
        socket.text += txt;

        var i;
        for(i=1; i<socket.text.length; i++)
        {
            if (socket.text[i] == '\b')
                socket.text =  socket.text.slice(0,i-1 ) + socket.text.slice(i+1);
        }

        if ((txt.substr(txt.length-1) == '\n') || (txt.substr(txt.length-1) == '\r'))
        {
            txt = socket.text;
            txt += "\r";
            broadcast(socket.name + ": " + txt, socket);
            socket.write(socket.name + ": " + txt);
            socket.text = "";
        }
    });

    socket.on('end', function(){
        clients.splice(clients.indexOf(socket), 1);
        broadcast(socket.name + " left the chat.\n", socket);
    });

    function broadcast(message, sender){
        clients.forEach(function(client){
            if(client === sender)
                return;
            client.write(message)
        });
        process.stdout.write(message);

    }

}).listen(5003);

console.log("chat server running at port 5003\n");