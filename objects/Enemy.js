class Enemy {
    constructor() {
        this.id = null;
        this.pos_x = null;
        this.pos_y = null;
        this.color = "green";
        this.width = 0;
        this.height = 0;
        this.velocity = null;
        this.velocityY = 10;
        this.currentHealth = 10;
        this.maxHealth = 10;
    }

    render(canvas) {
        canvas.draw(this.pos_x, this.pos_y, this.width, this.height, this.color);
        canvas.draw(this.pos_x, this.pos_y - 9, this.width, 6, 'red');
        canvas.draw(this.pos_x, this.pos_y - 9, this.width * (this.currentHealth / this.maxHealth), 6, 'green');
    }
}
