class RenderEngine{
    constructor(canvas) {
        this.canvas = canvas;
        this.players = [];
        this.bullets = [];
        this.enemies = [];
        this.gameInterface = new GameInterface();
        this.playerId = null;
        this.dimensions = {};
        this.ticks = 0;
    }

    addPlayers = (data)  => {

    }

    setPlayerId(id) {
        this.playerId = id;
    }

    setDimensions(dimensions) {
        this.dimensions = dimensions;
    }

    update = () => {

    }

    render = (data) => {
        this.ticks++;

        this.players = [];
        this.enemies = [];
        this.bullets = [];

        this.canvas.clear();


        let maxScore = 0;
        let topPlayer = null;
        let playerColor = null;

        data.game.players.forEach(data => {
            this.renderPlayer(data);
            if (data.points > maxScore) {
                maxScore = data.points;
                topPlayer = data.name;
                playerColor = data.color;
            }
        })

        if (topPlayer === null) {
            topPlayer = 'anon';
        }

        let topPlayerData = {
            name: topPlayer,
            points: maxScore,
            color: playerColor
        }

        data.game.bullets.forEach(data => {
            this.renderBullet(data);
        })

        data.game.enemies.forEach(data => {
            this.renderEnemies(data);

        })

        this.gameInterface.render(this.canvas, data.game.players.filter(player => player.id === this.playerId)[0], this.dimensions, topPlayerData, data.game.enemies.length);
    }

    renderPlayer(element) {
        let player = new Player(element.id, element.pos_x, element.pos_y, element.color);

        for(let x in element) {
            player[x] = element[x];
        }

        player.render(canvas);
        this.players.push(player);
    }

    renderBullet(element) {
        let bullet = new Bullet();
        for(let x in element) {
            bullet[x] = element[x];
        }

        bullet.render(canvas);
        this.bullets.push(bullet);
    }

    renderEnemies(element) {
        let enemy = new Enemy();

        for(let x in element) {
            enemy[x] = element[x];
        }

        enemy.render(canvas);
        this.enemies.push(enemy);
    }
}
