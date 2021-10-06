'use strict'

const Bullet = require('../Bullet');

module.exports = class SingleShot {
    constructor() {
        this.name = 'Single Shot';
        this.speed = 1;
    }

    shot(player) {
        return [
            new Bullet(0, player.pos_x + player.width / 2, player.pos_y, player),
        ];
    }
}
