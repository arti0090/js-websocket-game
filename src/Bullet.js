'use strict'

module.exports = class Bullet {
    static EFFECT_TYPE_KILL = 0;
    static EFFECT_TYPE_HIT = 1;

    constructor(id, pos_x, pos_y, object = null) {
        this.id = id;
        this.pos_x= pos_x;
        this.pos_y = pos_y;
        this.width = 5;
        this.height = 10;
        this.color = "red";
        this.velocity = 8;
        this.damage = 3;
        this.owner = object;
    }

    update() {
        this.pos_y -= this.velocity;
    }
}
