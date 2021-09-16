const socket = io();
const canvas = new Canvas('#canvas');
canvas.setDimensions(500, 500);

let players = [];
let bullets = [];

socket.on('test', data => {
    render(data);
});

socket.on('connected', data => {
    console.log('connected');
})

function debug(){
    socket.emit('debug');
}

function test() {};

let lastKey = null;
document.addEventListener('keydown', (event) => {
    if (event.keyCode === lastKey) {
        return;
    }

    if (event.key.includes("Arrow")) {
        lastKey = event.keyCode;
        socket.emit('move', event.keyCode);
    }

    if (event.keyCode === 32) {
        lastKey = event.keyCode;
        socket.emit('shot', event.keyCode);
    }
});

document.addEventListener('keyup', (event) => {
    lastKey = null;
    if (event.key.includes("Arrow") || event.keyCode === 32) {
        console.log('stop' + event.keyCode)
        socket.emit('stop', event.keyCode);
    }
});

function render(data) {
    canvas.clear()
    data.game.players.forEach(renderPlayer)
    data.game.bullets.forEach(renderBullet)
}

function renderPlayer(element) {
    let player = new Player(element.id, element.pos_x, element.pos_y, element.color);
    player.render(canvas);
    players.push(player);
}

function renderBullet(element) {
    let bullet = new Bullet(element.id, element.pos_x, element.pos_y);
    bullet.render(canvas);
    bullets.push(bullet);
}
