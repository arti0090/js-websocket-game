class Bullet {

    constructor(id, pos_x, pos_y) {
        this.id = id;
        this.pos_x = pos_x;
        this.pos_y = pos_y;
        this.width = 10;
        this.height = 5;
        this.color = "blue";
        this.velocity = 5;
        this.isFriendly = true;
    }

    render(canvas) {
        canvas.draw(this.pos_x, this.pos_y, this.width, this.height, this.color);
    }
}

if(typeof module !== "undefined"){
    module.exports = Bullet;
}
