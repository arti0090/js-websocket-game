const Enemy = require('./Enemy');
const Player = require('./Player');
const Bullet = require('./Bullet');
const functions = require('./functions');

module.exports = class GameEngine {
    constructor() {
        this.dimensions = {};
        this.ticks = 0;
        this.data = {};
        this.cache = {};
    }

    init() {
        this.dimensions = {
            width: 500,
            height: 500
        }

        this.data = {
            players: [],
            enemies: this.generateEnemies(20),
            bullets: [],
            connectedPlayers: 0,
        };
    }

    update() {
        if (this.data.enemies.length === 0) {
            this.cache.level++;
            this.data.enemies = this.generateEnemies(20, this.cache.level);
        }

        this.data.players.forEach(player => {
            player.update(this.ticks);

            if (37 in player.keysDown) {
                if (player.pos_x >= 0) {
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

            if (bullet.pos_y <= 0) {
                this.data.bullets.splice(x, 1);

                return;
            }

            for (let y = 0; y < this.data.enemies.length; y++) {
                let enemy = this.data.enemies[y];
                if (enemy.checkCollision(bullet)) {
                    let player = this.getPlayerById(bullet.owner.id);

                    let effect = enemy.onHit(bullet);

                    if (effect === Bullet.EFFECT_TYPE_KILL) {
                        player.points += 5;
                        this.data.enemies.splice(y, 1);
                    }

                    this.data.bullets.splice(x, 1);
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
        return this.data;
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

    removePlayer(id) {
        for (let x in this.data.players) {
            if (this.data.players[x].id === id) {
                this.data.players.splice(x, 1);
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

    generateEnemies(amount, velocity = 1) {
        let enemies = [];

        let enemiesPerLine = 10;

        let y = 20;
        let enemyHeight = 30;
        let enemyWidth = 30;

        let enemyStartX = 20;

        for (let x = 0; x < amount; x++) {
            if (enemies.length % enemiesPerLine === 0) {
                y+= enemyHeight + 20;
                enemyStartX = 20;
            }
            enemies.push(new Enemy(enemies.length, enemyStartX += (enemyWidth + 10), y, enemyWidth, enemyHeight, velocity));
        }

        return enemies;
    }

}