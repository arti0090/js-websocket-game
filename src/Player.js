'use strict'

const Bullet = require('./Bullet');
const ObjectTypes = require('./ObjectTypes');
const functions = require('./functions');

module.exports = class Player {
    constructor(id, pos_x, pos_y, color = "red") {
        this.id = id;
        this.socketId = id;
        this.uuid = global.uuid();
        this.pos_x = pos_x;
        this.pos_y = pos_y;
        this.color = color;
        this.width = 40;
        this.height = 40;
        this.color = color;
        this.keysDown = [];
        this.lastShot = 0;
        this.bulletCooldown = 10;
        this.bulletCooldownLeft = this.bulletCooldown;
        this.velocity = 3;
        this.points = 0;
        this.currentHealth = 10;
        this.bulletSpeed = 80;
        this.maxHealth = 10;
        this.type = ObjectTypes.TYPE_PLAYER;
        this.removed = false;
        this.collidesWith = [];
        this.maxBullets = 5;
        this.bullets = 0;
        this.name = null
        this.render = true;
        this.dimensions = global.dimensions();
        this.weapon = functions.getRandomWeapon();
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
            weapon: this.weapon.name,
            maxBullets: this.maxBullets,
            bulletSpeed: this.bulletSpeed
        }
    }

    remove() {
        this.removed = true;

    }

    update(gameTicks) {
        if (this.bulletCooldownLeft < this.bulletCooldown) {
            this.bulletCooldownLeft++;
        }

        if (37 in this.keysDown) {
            if (this.pos_x >= this.dimensions.startX + this.velocity) {
                this.moveLeft();
            }
        }

        if (39 in this.keysDown) {
            if (this.pos_x + this.width <= this.dimensions.width) {
                this.moveRight();
            }
        }

        if (32 in this.keysDown && this.canShoot(gameTicks)) {
            let bullets = this.onShot();

            bullets.forEach(bullet => {
                global.addObject(bullet);
            })
        }
    }

    canShoot(gameTicks) {
        if (this.bulletCooldownLeft >= this.bulletCooldown && this.bullets < this.maxBullets) {
            this.lastShot = gameTicks;
            this.bulletCooldownLeft = 0;
            return true
        }

        return false;
    }

    onCollision(object) {

    }

    onShot() {
        return this.weapon.shot(this);
    }

    moveLeft() {
        this.pos_x -= this.velocity;
    }

    moveRight() {
        this.pos_x += this.velocity;
    }
}
