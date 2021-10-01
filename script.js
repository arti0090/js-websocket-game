const socket = io();
const canvas = new Canvas('#canvas');
canvas.setDimensions(500, 500);

let engine = new RenderEngine(canvas);

socket.on('test', data => {
    engine.render(data);
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
    let keyCode = event.keyCode;
    if (keyCode === lastKey) {
        return;
    }

    if (keyCode === 39 || keyCode === 37) {
        lastKey = keyCode;
        socket.emit('move', keyCode);
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
