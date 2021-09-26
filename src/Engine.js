class Engine{
    constructor(canvas) {
        this.canvas = canvas;
        this.players = [];
        this.bullets = [];
        this.enemies = [];
    }

    addPlayers = (data)  => {

    }

    update = () => {

    }

    render = (data) => {
        this.canvas.clear();
        let maxScore = 0;
        data.game.players.forEach(data => {
            this.renderPlayer(data);
            if (data.points > maxScore) {
                maxScore = data.points;
            }
        })

        data.game.bullets.forEach(data => {
            this.renderBullet(data);
        })

        data.game.enemies.forEach(data => {
            this.renderEnemies(data);

        })

        this.canvas.draw(0, 0, 500, 30, 'black');
        this.canvas.write(`Leading player points: ${maxScore}`, 10, 20);
    }

    renderPlayer(element) {
        let player = new Player(element.id, element.pos_x, element.pos_y, element.color);
        player.points = element.points;
        player.render(canvas);
        this.players.push(player);
    }

    renderBullet(element) {
        let bullet = new Bullet(element.id, element.pos_x, element.pos_y);
        bullet.render(canvas);
        this.bullets.push(bullet);
    }

    renderEnemies(element) {
        let enemy = new Enemy(element.id, element.pos_x, element.pos_y, element.width ,element.height);
        enemy.render(canvas);
        this.enemies.push(enemy);
    }
}

if(typeof module !== "undefined"){
    module.exports = Engine;
}