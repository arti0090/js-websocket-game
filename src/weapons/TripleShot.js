'use strict'

const Bullet = require('../Bullet');

module.exports = class TripleShot {
    constructor() {
        this.name = 'Triple Shot';
        this.speed = 1;
    }

    shot(player) {
        let bullets = [
            new Bullet(0, player.pos_x + player.width/4 , player.pos_y, player),
            new Bullet(0, player.pos_x + player.width /2, player.pos_y, player),
            new Bullet(0, player.pos_x + player.width - player.width/4 , player.pos_y, player)
        ]

        bullets[0].velocityX = 1;
        bullets[2].velocityX = -1;

        bullets.forEach(bullet => {
            bullet.color = 'cyan';
            bullet.width = 1;
            bullet.height = 6;
        })

        return bullets;
    }
}
