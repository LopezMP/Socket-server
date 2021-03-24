let app = require('express')();
let server = require('http').createServer(app);
let io = require('socket.io')(server);

io.on('connection', (socket) => {   //Solo se ejecuta cuando un cliente se conecta al servidor (tambien autentificación)

    //cada vez que la app envia uno de estos eventos, el servidor reacciona socket.on (react to something)
    socket.on('disconnect', function () {
        io.emit('users-changed', { user: socket.username, event: 'left' });
    });

    //guardamos nuestro nombre en el objeto socket.username
    socket.on('set-name', (name) => {
        socket.username = name;
        //notificacion a los usuarios conectados que te has unido
        io.emit('users-changed', { user: name, event: 'joined' });
    });

    socket.on('send-message', (message) => {

        //emitimos "emit" el mensaje a todos los usuarios conectados, el nombre del usuario que ha enviado el mensaje y la hora
        io.emit('message', { msg: message.text, user: socket.username, createdAt: new Date() });
    });
});

var port = process.env.PORT || 3001;

server.listen(port, function () {
    console.log('listening in http://localhost:' + port);
});
