class Bullet {
    constructor() {
        this.id = 0;
        this.pos_x= 0;
        this.pos_y = 0;
        this.width = 5;
        this.height = 10;
        this.color = "red";
        this.velocity = 8;
        this.damage = 3;
        this.owner = null;
    }

    render(canvas) {
        canvas.draw(this.pos_x, this.pos_y, this.width, this.height, this.color);
    }
}
