const Enemy = require('./Enemy');
const Player = require('./Player');
const Bullet = require('./Bullet');
const ObjectTypes = require('./ObjectTypes');

const functions = require('./functions');

module.exports = class GameEngine {
    constructor() {
        this.dimensions = {};
        this.ticks = 0;
        this.data = {};
        this.cache = {};
        this.objectsToRemove = {};
    }

    init() {
        this.dimensions = {
            width: 500,
            height: 500,
            startX: 75,
            startY: 20
        };

        this.data = {
            objects: this.generateEnemies(20),
            // players: [],
            // enemies: this.generateEnemies(20),
            // bullets: [],
            connectedPlayers: 0,
        };
        this.cache = {
            level: 1,
        }

        this.clearRemoveCache();
    }

    clearRemoveCache() {
        [ObjectTypes.TYPE_BULLET, ObjectTypes.TYPE_ENEMY, ObjectTypes.TYPE_PLAYER].forEach(type => {
            this.objectsToRemove[type] = [];
        })
    }

    addObject(object) {
        object.id = this.data.objects.length;
        this.data.objects.push(object);
    }

    update() {
        this.handleRemoval();

        if (this.data.objects.filter(obj => obj.type === ObjectTypes.TYPE_ENEMY).length === 0) {
            this.cache.level++;
            this.data.objects = this.data.objects.concat(this.generateEnemies(20, this.cache.level));
        }

        this.data.objects.forEach(object => {
            object.update(this.ticks);
        })

        this.data.objects.forEach(object => {
            this.data.objects.filter(obj => {
                return (
                    object.collidesWith.includes(obj.type)
                );
            }).forEach(collider => {
                if (collider.checkCollision(object)) {
                    object.onCollision(collider);
                }
            })
        })

        this.ticks++;
    }

    render() {

    }

    getData() {
        let enemies = this.data.objects.filter(object => object.type === ObjectTypes.TYPE_ENEMY);

        let players = this.data.objects.filter(object => {
            return ( object.type === ObjectTypes.TYPE_PLAYER && object.render === true);
        });

        let bullets = this.data.objects.filter(object => {
            return ( object.type === ObjectTypes.TYPE_BULLET && object.render === true);
        });

        for(let i = 0; i < players.length; i++) {
            players[i] = players[i].data();
        }

        for(let i = 0; i < enemies.length; i++) {
            enemies[i] = enemies[i].data();
        }

        for(let i = 0; i < bullets.length; i++) {
            bullets[i] = bullets[i].data();
        }

        return {
            players: players,
            enemies: enemies,
            bullets: bullets,
            connectedPlayers: this.data.connectedPlayers,
        }
    }

    addObjectToRemove(object){
        object.remove();
    }

    handleRemoval() {
        this.data.objects = this.data.objects.filter(object => object.removed === false);
    }

    handleMove(socket, data) {
        let player = this.getPlayerById(socket.id);

        if (!player) {
            return;
        }

        if (player)
            player.keysDown[data] = true;
    }

    handleStop(socket, data) {
        let player = this.getPlayerById(socket.id);

        if (!player) {
            console.log(`player with socket id ${socket.id} not found`)
            return;
        }

        if (player.keysDown)
            delete player.keysDown[data];
    }

    handleShot(socket, data) {
        let player = this.getPlayerById(socket.id);

        if (player) {
            player.keysDown[data] = true;
        }
    }

    login(socket, data) {
        let player = this.getPlayerByName(data.name);

        if (!player) {
            player = this.getPlayerById(socket.id);
            player.name = data.name;

            return;
        }

        this.removePlayer(socket.id);

        player.render = true;
        player.socketId = socket.id;
        player.id = this.data.objects.length;
    }

    removePlayer(id) {
        for (let x in this.data.objects) {
            if (this.data.objects[x].type === ObjectTypes.TYPE_PLAYER && this.data.objects[x].socketId === id) {
                if (this.data.objects[x].name !== null) {
                    this.data.objects[x].render = false;
                }else {
                    this.data.objects.splice(x, 1);
                }
            }
        }
    }

    addPlayer(id) {
        this.data.objects.push(new Player(id, 150, 450, functions.getRandomColor()))
    }

    getPlayerById(id) {
        return this.data.objects.filter(object => {
            return (object.type === ObjectTypes.TYPE_PLAYER && object.socketId === id)
        }).shift();
    }

    getPlayerByName(name) {
        return this.data.objects.filter(object => {
            return (object.type === ObjectTypes.TYPE_PLAYER && object.name === name)
        }).shift();
    }

    generateEnemies(amount, velocity = 1) {
        let enemies = [];

        let enemiesPerLine = 8;

        let y = this.dimensions.startY;
        let enemyHeight = 30;
        let enemyWidth = 30;

        let enemyStartX = this.dimensions.startX + 20;

        for (let x = 0; x < amount; x++) {
            if (enemies.length % enemiesPerLine === 0) {
                y+= enemyHeight + 20;
                enemyStartX = this.dimensions.startX + 20;
            }
            enemies.push(new Enemy(enemies.length, enemyStartX += (enemyWidth + 10), y, enemyWidth, enemyHeight, velocity));
        }

        return enemies;
    }

}
