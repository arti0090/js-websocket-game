'use strict'

const Bullet = require('../Bullet');

module.exports = class QuadShot {
    constructor() {
        this.name = 'Quad Shot';
        this.speed = 1.25;
    }

    shot(player) {
        let bullets = [
            new Bullet(0, player.pos_x, player.pos_y, player),
            new Bullet(0, player.pos_x +  player.width/3 , player.pos_y, player),
            new Bullet(0, player.pos_x + player.width - player.width/3 , player.pos_y, player),
            new Bullet(0, player.pos_x + player.width , player.pos_y, player)
        ]

        bullets.forEach(bullet => {
            bullet.color = 'red';
            bullet.width = 5;
            bullet.height = 5;
        })

        return bullets;
    }
}
