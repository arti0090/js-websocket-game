const socket = io();

socket.on('test', data => {
    if(data){
       console.log(data);
    }
});

function test() {};