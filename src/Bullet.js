'use strict'

const ObjectTypes = require('./ObjectTypes');

module.exports = class Bullet {
    static EFFECT_TYPE_KILL = 0;
    static EFFECT_TYPE_HIT = 1;

    constructor(id, pos_x, pos_y, object = null) {
        this.id = id;
        this.uuid = global.uuid();
        this.pos_x= pos_x;
        this.pos_y = pos_y;
        this.width = 3;
        this.height = 10;
        this.color = "red";
        this.velocityY = 4;
        this.velocityX = 0;
        this.damage = 3;
        this.owner = object;
        this.velocity = this.owner.bulletSpeed / 100;
        this.type = ObjectTypes.TYPE_BULLET;
        this.collision = true;
        this.collidesWith = [ObjectTypes.TYPE_ENEMY]
        this.removed = false;
        this.render = true;
        this.owner.bullets++;
    }

    remove() {
        this.removed = true;
        this.owner.bullets--;
    }

    checkCollision(object) {
        return (
            object.pos_x + object.width >= this.pos_x &&
            object.pos_x <= this.pos_x + this.width &&
            object.pos_y + object.height >= this.pos_y &&
            object.pos_y <= this.pos_y + this.height
        );
    }

    onCollision(object) {
        global.removeObject(this);
    }

    data() {
        return {
            pos_x: this.pos_x,
            pos_y: this.pos_y,
            width: this.width,
            height: this.height,
            color: this.color,
        }
    }

    update() {
        this.pos_y -= this.velocityY * this.velocity * this.owner.weapon.speed;
        this.pos_x -= this.velocityX * this.velocity * this.owner.weapon.speed;

        if (this.pos_y < 0) {
            global.removeObject(this);
        }
    }
}
