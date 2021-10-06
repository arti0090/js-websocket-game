const express = require('express')
const app = express()
const server = require('http').createServer(app)
const path = require('path')
const io = require('socket.io')(server)

const GameEngine = require('./src/GameEngine');

app.use(express.static(path.join(__dirname, '/')))


global.uuid = () => {
    return 'xxxxxxxx-xxxx'.replace(/[xy]/g, function(c) {
        let r = Math.random() * 16 | 0, v = c === 'x' ? r : (r & 0x3 | 0x8);
        return v.toString(16);
    });
}

let gameEngine = new GameEngine();
gameEngine.init();

global.dimensions = () => {
    return gameEngine.dimensions;
}

global.removeObject = (object) => {
    gameEngine.addObjectToRemove(object);
}

global.addObject = (object) => {
    gameEngine.addObject(object);
}

global.getPlayerById = (id) => {
    return gameEngine.getPlayerById(id);
}

global.images = [];

const port = process.env.PORT || 3000
server.listen(port, () => {
    console.log('listening on: *', port);
})

clients = [];

setInterval(function(){ game()}, 1000/60);

io.on('connection', socket => {
    socket.id = clients.length;

    socket.emit('connected', {id: socket.id, dimensions: gameEngine.dimensions, images: global.images});
    gameEngine.addPlayer(socket.id);
    clients.push(socket);

    socket.on('move', data => {
        gameEngine.handleMove(socket, data);
    })

    socket.on('stop', data => {
        gameEngine.handleStop(socket, data);
    })

    socket.on('login', data => {
        gameEngine.login(socket, data);
    })

    socket.on('disconnect', () => {
        console.log(`client with id ${socket.id} disconnected !`);
        removeClient(socket.id);
        console.log(`connected clients: ${clients.length}`)
    })

    socket.on('shot', data => {
        gameEngine.handleShot(socket, data);
    })
})

function render() {
    clients.forEach(client => {
        if (client !== false) {
            client.emit('test', {id: client.id, game: gameEngine.getData(), player: gameEngine.getPlayerById(client.id)});
        }
    })
}

function game(){
    render();
    gameEngine.update();
}

function removeClient(id) {
    for (let x in clients) {
        if (clients[x].id === id) {
            clients[x] = false;
        }
    }

    gameEngine.removePlayer(id);
}
