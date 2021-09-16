const express = require('express')
const app = express()
const server = require('http').createServer(app)
const path = require('path')
const io = require('socket.io')(server)
app.use(express.static(path.join(__dirname, '/')))

const port = process.env.PORT || 3000
server.listen(port, () => {
    console.log('listening on: *', port);
})

main_client = null;
data = {"test": "test"};

io.on('connection', socket => {
    console.log('connected');
    
    setInterval(function(){ test()}, 3000);

    main_client = socket;
})

function test() {
    main_client.emit('test', data); 
};