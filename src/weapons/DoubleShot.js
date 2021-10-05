'use strict'

const Bullet = require('../Bullet');

module.exports = class DoubleShot {
    constructor() {
        this.name = 'Double Shot';
        this.speed = 0.75;
    }

    shot(player) {
        let bullets = [
            new Bullet(0, player.pos_x + player.width/4 , player.pos_y, player),
            new Bullet(0, player.pos_x + player.width - player.width/4 , player.pos_y, player)
        ]

        bullets.forEach(bullet => {
            bullet.color = 'green';
            bullet.width = 2;
            bullet.height = 2;
        })

        return bullets;
    }
}
