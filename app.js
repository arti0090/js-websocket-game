const express = require('express')
const app = express()
const server = require('http').createServer(app)
const path = require('path')
const io = require('socket.io')(server)

const Player = require('./src/Player');
const Bullet = require('./src/Bullet');

app.use(express.static(path.join(__dirname, '/')))

let gameTicks = 0;

let gameData = {
    players: [],
    enemies: [],
    bullets: [],
};

function getRandomInt(min, max) {
    min = Math.ceil(min);
    max = Math.floor(max);
    return Math.floor(Math.random() * (max - min)) + min;
}

randomColor = () => {
    return `rgb(${getRandomInt(0, 255)}, ${getRandomInt(0, 255)}, ${getRandomInt(0, 255)})`;
}

const port = process.env.PORT || 3000
server.listen(port, () => {
    console.log('listening on: *', port);
})

clients = [];

data = {"test": "test"};
setInterval(function(){ game()}, 6);

io.on('connection', socket => {
    socket.id = clients.length;

    socket.emit('connected', {id: socket.id});
    gameData.players.push(new Player(socket.id, 0, 0, randomColor()))
    clients.push(socket);

    socket.on('move', data => {
        movePlayer(socket, data);
    })

    socket.on('debug', data => {
        debug(data);
    })
    socket.on('stop', data => {
        stopPlayer(socket, data);
    })

    socket.on('disconnect', () => {
        console.log(`client with id ${socket.id} disconnected !`);
        removeClient(socket.id);
        console.log(`connected clients: ${clients.length}`)
    })

    socket.on('shot', data => {
        shot(socket.id, data);
    })
})

function debug(data) {
    console.log(gameData.bullets.length);
}

function shot(playerId, data) {
    let player = getPlayerById(playerId);

    if (player) {
        player.keysDown[data] = true;
    }
}

function movePlayer(socket, data) {
    player = getPlayerById(socket.id);

    if (player)
        player.keysDown[data] = true;

    if (player === null) {
    }
}

function stopPlayer(socket, data) {
    player = getPlayerById(socket.id);

    if (player)
        delete player.keysDown[data];
}

function render() {
    clients.forEach(client => {
        if (client !== false)
            client.emit('test', {id: client.id, game: gameData});
    })
};

function update() {
    gameData.players.forEach(player => {
        if (37 in player.keysDown) {
            player.pos_x -= 3;
        }
        if (39 in player.keysDown) {
            player.pos_x += 3;
        }
        if (38 in player.keysDown) {
            player.pos_y -= 3;
        }
        if (40 in player.keysDown) {
            player.pos_y += 3;
        }
        if (32 in player.keysDown && player.canShoot(gameTicks)) {
            gameData.bullets.push(new Bullet(gameData.bullets.length, player.pos_x + player.width, player.pos_y + player.height/2))
        }
    })

    for (let x = 0; x < gameData.bullets.length; x++) {
        let bullet = gameData.bullets[x];
        if (bullet.pos_x + bullet.width < 500) {
            bullet.pos_x += bullet.velocity;
        } else {
            gameData.bullets.splice(x, 1);
        }
    }

}

function game(){
    render();

    update();

    gameTicks++;
}

function removeClient(id) {
    for (let x in clients) {
        if (clients[x].id === id) {
            clients[x] = false;
        }
    }

    for (let x in gameData.players) {
        if (gameData.players[x].id === id) {
            gameData.players.splice(x, 1);
        }
    }
}

function getPlayerById(id) {
    for (let x in gameData.players) {
        if (gameData.players[x].id === id) {
            return gameData.players[x];
        }
    }

    return null;
}
