const isServer = (GetConvar('xchat_server', 'false') == 'true')

if (isServer) {

    const app = require('express')();
    const http = require('http').createServer(app);
    const io = require('socket.io')(http);

    http.listen(GetConvarInt('xchat_server_port', 30220), () => {});

    io.on('connection', (socket) => {
        console.log('xchat: new listener');
        socket.on('xmessage', (data) => {
            socket.broadcast.emit('xmessage', data);
            emit('xchat:receivedData', data);
        });
        socket.on('disconnect', () => {
            console.log('xchat: listener left');
        });
    });

    on('xchat:sendData', (data, cb) => {
        io.emit('xmessage', data);
        if (cb != null) { cb(true); }
    });

} else {

    const ioc = require('socket.io-client')(GetConvar('xchat_endpoint', 'http://localhost'));
    ioc.on('connect', () => { console.log('xchat: connected to host'); });
    ioc.on('disconnect', () => { console.log('xchat: disconnected from host'); });
    ioc.on('xmessage', (data) => { emit('xchat:receivedData', data); });

    on('xchat:sendData', (data, cb) => {
        if (ioc.connected) {
            ioc.emit('xmessage', data);
            if (cb != null) { cb(true); }
        } else {
            if (cb != null) { cb(false); }
        }
    });

}
