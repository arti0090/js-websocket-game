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
            players: [],
            enemies: this.generateEnemies(20),
            bullets: [],
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

    update() {
        this.handleRemoval();

        if (this.data.enemies.length === 0) {
            this.cache.level++;
            this.data.enemies = this.generateEnemies(20, this.cache.level);
        }

        this.data.players.forEach(player => {
            player.update(this.ticks);

            if (37 in player.keysDown) {
                if (player.pos_x >= this.dimensions.startX + player.velocity) {
                    player.moveLeft();
                }
            }

            if (39 in player.keysDown) {
                if (player.pos_x + player.width <= this.dimensions.width) {
                    player.moveRight();
                }
            }

            if (32 in player.keysDown && player.canShoot(this.ticks)) {
                let bullets = player.onShot();

                bullets.forEach(bullet => {
                    bullet.id = this.data.bullets.length;
                    this.data.bullets.push(bullet);
                })
            }
        })

        for (let x = 0; x < this.data.bullets.length; x++) {
            this.data.bullets[x].update();

            let bullet = this.data.bullets[x];

            for (let y = 0; y < this.data.enemies.length; y++) {
                let enemy = this.data.enemies[y];
                if (enemy.checkCollision(bullet) && bullet.removed === false) {
                    let player = this.getPlayerById(bullet.owner.id);

                    let effect = enemy.onHit(bullet);

                    if (effect === Bullet.EFFECT_TYPE_KILL) {
                        if (player) {
                            player.points += 5;
                        }

                        global.removeObject(enemy);
                    }

                    global.removeObject(bullet);
                }
            }

        }

        this.data.enemies.forEach(enemy => {
            enemy.update();
        })

        this.ticks++;
    }

    render() {

    }

    getData() {
        let enemies = [];
        this.data.enemies.forEach(enemy => {
            enemies.push(enemy.data());
        })
        let players = [];
        this.data.players.forEach(player => {
            if (player.render === true) {
                players.push(player.data());
            }
        })
        let bullets = [];
        this.data.bullets.forEach(bullet => {
            bullets.push(bullet.data());
        })
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
        this.data.bullets = this.data.bullets.filter(object => object.removed === false);
        this.data.enemies = this.data.enemies.filter(object => object.removed === false);
        this.data.players = this.data.players.filter(object => object.removed === false);
    }

    handleMove(socket, data) {
        let player = this.getPlayerById(socket.id);

        if (player)
            player.keysDown[data] = true;

        if (player === null) {

        }
    }

    handleStop(socket, data) {
        let player = this.getPlayerById(socket.id);

        if (player)
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
        player.id = socket.id;
    }


    removePlayer(id) {
        for (let x in this.data.players) {
            if (this.data.players[x].id === id) {
                if (this.data.players[x].name !== null) {
                    this.data.players[x].render = false;
                }else {
                    this.data.players.splice(x, 1);
                }
            }
        }
    }

    addPlayer(id) {
        this.data.players.push(new Player(id, 150, 450, functions.getRandomColor()))
    }

    getPlayerById(id) {
        for (let x in this.data.players) {
            if (this.data.players[x].id === id) {
                return this.data.players[x];
            }
        }

        return null;
    }

    getPlayerByName(name) {
        for (let x in this.data.players) {
            if (this.data.players[x].name === name) {
                return this.data.players[x];
            }
        }

        return null;
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
