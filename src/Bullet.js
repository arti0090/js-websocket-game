class Bullet {

    constructor(id, pos_x, pos_y, object = null) {
        this.id = id;
        this.pos_x= pos_x;
        this.pos_y = pos_y;
        this.width = 5;
        this.height = 10;
        this.color = "blue";
        this.velocity = 5;

        this.owner = object;
    }

    render(canvas) {
        canvas.draw(this.pos_x, this.pos_y, this.width, this.height, this.color);
    }
}

if(typeof module !== "undefined"){
    module.exports = Bullet;
}
