const socket = io();
const canvas = new Canvas('#canvas');
canvas.setDimensions(500, 500);

let engine = new RenderEngine(canvas);

socket.on('test', data => {
    engine.render(data);
});

socket.on('connected', data => {
    engine.setPlayerId(data.id);
    engine.setDimensions(data.dimensions);
})

function debug(){
    socket.emit('debug');
}

function test() {};

let lastKey = null;
document.addEventListener('keydown', (event) => {
    let keyCode = event.keyCode;
    if (keyCode === lastKey) {
        return;
    }

    if (keyCode === 39 || keyCode === 37) {
        lastKey = keyCode;
        socket.emit('move', keyCode);
    }

    if (keyCode === 76) {
        let name = window.prompt('Enter your name here');

        if (!name) return;
        socket.emit('login', {
            name: name,
        });
    }

    if (keyCode === 32) {
        lastKey = keyCode;
        socket.emit('shot', keyCode);
    }
});

document.addEventListener('keyup', (event) => {
    lastKey = null;
    if (event.key.includes("Arrow") || event.keyCode === 32) {
        socket.emit('stop', event.keyCode);
    }
});
