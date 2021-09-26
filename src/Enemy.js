class Enemy {

    constructor(id, pos_x, pos_y, width, height, velocity = null) {
        this.id = id;
        this.pos_x = pos_x;
        this.pos_y = pos_y;
        this.color = "green";
        this.width = width;
        this.height = height;
        this.velocity = velocity;
        this.velocityY = 10;
    }

    update () {
        if (this.pos_y < 400 && this.pos_y > 380) {
            this.velocityY = -10;
        }

        if (this.pos_y < 50) {
            this.velocityY = 10;
        }

        this.pos_x += this.velocity;
        if (this.pos_x + this.width > 500) {
            this.velocity = -this.velocity;
            this.pos_y += this.velocityY;
        }
        if (this.pos_x <= 0) {
            this.velocity = -this.velocity;
            this.pos_y += this.velocityY;
        }
    }

    render(canvas) {
        canvas.draw(this.pos_x, this.pos_y, this.width, this.height, this.color);
        canvas.write(this.velocityY, this.pos_x + 5, this.pos_y + 10);

    }

    checkCollision(object) {
        return (
            object.pos_x + object.width >= this.pos_x &&
            object.pos_x <= this.pos_x + this.width &&
            object.pos_y + object.height >= this.pos_y &&
            object.pos_y <= this.pos_y + this.height
        );
    }

}

if(typeof module !== "undefined") {
    module.exports = Enemy;
}