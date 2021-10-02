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
        this.velocity = 8;
        this.damage = 3;
        this.owner = object;
        this.type = ObjectTypes.TYPE_BULLET;
        this.removed = false;
        this.type = ObjectTypes.TYPE_BULLET;
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
            color: this.color,
        }
    }

    update() {
        this.pos_y -= this.velocity;
        if (this.pos_y < 0) {
            global.removeObject(this);
        }
    }
}
