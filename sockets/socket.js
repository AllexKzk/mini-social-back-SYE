const http = require('http');
const { Server } = require("socket.io");

module.exports = function(app){
    const server = http.createServer(app);
    const io = new Server(server, { cors: { origin: "*"} });

    io.on('connection', (socket) => {
        console.log('user connected');

        socket.on('connect to profile', (...args) => {
            const pId = args[0]?.pId;
            if (pId){
                console.log('user join room ', pId);
                socket.join(`profile: ${pId}`);
            }
        });

        socket.on('disconnect from profile', (...args) => {
            const pId = args[0]?.pId;
            if (pId){
                console.log('user leave room ', pId);
                socket.leave(`profile: ${pId}`)
            }
        });

        socket.on('disconnect', () => {
            console.log('user disconnected');
        });
    });

    server.listen(4000);
}

