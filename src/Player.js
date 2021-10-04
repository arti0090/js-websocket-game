'use strict'

const Bullet = require('./Bullet');
const ObjectTypes = require('./ObjectTypes');

module.exports = class Player {
    constructor(id, pos_x, pos_y, color = "red") {
        this.id = id;
        this.uuid = global.uuid();
        this.pos_x = pos_x;
        this.pos_y = pos_y;
        this.color = color;
        this.width = 40;
        this.height = 40;
        this.color = color;
        this.keysDown = [];
        this.lastShot = 0;
        this.bulletCooldown = 15;
        this.bulletCooldownLeft = this.bulletCooldown;
        this.velocity = 3;
        this.points = 0;
        this.currentHealth = 10;
        this.maxHealth = 10;
        this.type = ObjectTypes.TYPE_PLAYER;
        this.removed = false;
        this.type = ObjectTypes.TYPE_PLAYER;
        this.maxBullets = 5;
        this.bullets = 5;
        this.name = null
        this.render = true;
    }

    data() {
        return {
            id: this.id,
            pos_x: this.pos_x,
            pos_y: this.pos_y,
            width: this.width,
            height: this.height,
            color: this.color,
            points: this.points,
            bulletCooldown: this.bulletCooldown,
            bulletCooldownLeft: this.bulletCooldownLeft,
            currentHealth: this.currentHealth,
            maxHealth: this.maxHealth,
            velocity: this.velocity,
            name: this.name,
        }
    }

    remove() {
        this.removed = true;

    }

    update(gameTicks) {
        if (this.bulletCooldownLeft < this.bulletCooldown) {
            this.bulletCooldownLeft++;
        }
    }

    canShoot(gameTicks) {
        if (this.bulletCooldownLeft >= this.bulletCooldown) {
            this.lastShot = gameTicks;
            this.bulletCooldownLeft = 0;
            return true
        }

        return false;
    }

    onShot() {
        return [new Bullet(0, this.pos_x + this.width/2 , this.pos_y, this)];
    }

    moveLeft() {
        this.pos_x -= this.velocity;
    }

    moveRight() {
        this.pos_x += this.velocity;
    }
}
