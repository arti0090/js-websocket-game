'use strict'

const Bullet = require('./Bullet');
const ObjectTypes = require('./ObjectTypes');
const functions = require('./functions');

module.exports = class Enemy {
    constructor(id, pos_x, pos_y, width, height, velocity = null) {
        this.id = id;
        this.pos_x = pos_x;
        this.pos_y = pos_y;
        this.color = "green";
        this.width = width;
        this.height = height;
        this.velocity = velocity;
        this.velocityY = 10;
        this.maxHealth = 1;
        this.currentHealth = this.maxHealth;
        this.type = ObjectTypes.TYPE_ENEMY;
        this.bulletSpeed = 100;
        this.collidesWith = [ObjectTypes.TYPE_BULLET];
        this.removed = false;
        this.render = true;
        this.damage = 1;
        this.weapon = {
            speed: 2,
        }
        this.image = `enemy_${functions.getRandomInt(1,4)}.png`;
    }

    remove() {
        this.removed = true;
    }

    data() {
        return {
            pos_x: this.pos_x,
            pos_y: this.pos_y,
            width: this.width,
            height: this.height,
            currentHealth: this.currentHealth,
            maxHealth: this.maxHealth,
            color: this.color,
            image: this.image,
        }
    }

    update () {
        if (Math.random() < 0.001) {
            this.shot();
        }

        if (this.pos_y < 400 && this.pos_y > 380) {
            this.velocityY = -10;
        }

        if (this.pos_y <= global.dimensions().startY) {
            this.velocityY = 10;
        }

        this.pos_x += this.velocity;
        if (this.pos_x + this.width > 500) {
            this.velocity = -this.velocity;
            this.pos_y += this.velocityY;
        }
        if (this.pos_x <= global.dimensions().startX) {
            this.velocity = -this.velocity;
            this.pos_y += this.velocityY;
        }
    }

    onCollision(object) {
        if (object.type === ObjectTypes.TYPE_BULLET) {
            let effect = this.onHit(object);

            if (effect === Bullet.EFFECT_TYPE_KILL) {
                let player = global.getPlayerById(object.owner.id);
                if (player) {
                    player.points += 5;
                }

                global.removeObject(this);
            }
        }
    }

    shot() {
        let bullet = new Bullet(0, this.pos_x + this.width / 2, this.pos_y + this.height, this);

        bullet.collidesWith = [ObjectTypes.TYPE_PLAYER, ObjectTypes.TYPE_BULLET];
        bullet.velocityY = -1;
        bullet.damage = this.damage;

        global.addObject(bullet);
    }

    checkCollision(object) {
        return (
            object.pos_x + object.width >= this.pos_x &&
            object.pos_x <= this.pos_x + this.width &&
            object.pos_y + object.height >= this.pos_y &&
            object.pos_y <= this.pos_y + this.height
        );
    }

    onHit(bullet) {
        this.currentHealth -= bullet.damage;

        if (this.currentHealth <= 0) {
            this.currentHealth = 0;
            return Bullet.EFFECT_TYPE_KILL;
        }

        return Bullet.EFFECT_TYPE_HIT;
    }
}
