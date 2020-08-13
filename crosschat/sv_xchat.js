const isServer = (GetConvar('xchat_server', 'false') == 'true');

if (isServer) {

    const app = require('express')();
    const http = require('http').createServer(app);
    const io = require('socket.io')(http);

    http.listen(GetConvarInt('xchat_server_port', 30220), () => {
        console.log('xchat: acting as host');
    });

    io.use((socket, next) => {
        let pass = GetConvar('xchat_token', '');
        if (pass == '') pass = GetConvar('rcon_password', '');
        if (pass != '') {
            const token = socket.handshake.headers['xchat-token'];
            if (token != pass) return next(new Error('authentication error'));
        }
        return next();
    });

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
    let pass = GetConvar('xchat_token', '');
    if (pass == '') pass = GetConvar('rcon_password', '');
    const ioc = require('socket.io-client')(GetConvar('xchat_endpoint', 'http://localhost'), {
        transportOptions: { polling: { extraHeaders: { 'xchat-token': pass, }, }, },
    });
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
