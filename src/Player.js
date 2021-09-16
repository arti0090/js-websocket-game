class Player {

    constructor(id, pos_x, pos_y, color = "red") {
        this.id = id;
        this.pos_x = pos_x;
        this.pos_y = pos_y;
        this.color = color;
        this.width = 20;
        this.height = 20;
        this.color = color;
        this.keysDown = [];
        this.lastShot = 0;
        this.bulletCooldown = 20;
    }

    render(canvas) {
        canvas.draw(this.pos_x, this.pos_y, this.width, this.height, this.color);
    }

    canShoot(gameTicks) {
        if (gameTicks >= this.bulletCooldown + this.lastShot) {
            this.lastShot = gameTicks;
            return true
        }
        else return false;
    }

}

if(typeof module !== "undefined"){
    module.exports = Player;
}

