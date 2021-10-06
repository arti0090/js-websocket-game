class GameInterface {
    constructor() {
    }

    render(canvas, data, dimensions, maxScoreData, enemies) {
        canvas.draw(0, 0, dimensions.startX, dimensions.height, 'black');
        canvas.draw(0, 0, 500, 30, 'black');

        if (!data.name) {
            canvas.write(`Press [L] to login`, 350, 20);
            data.name = '';
        } else {
            canvas.write(`Logged in as ${data.name}`, 350, 20);
        }

        canvas.write(`Leading player`, 10, 20);

        canvas.setFillColor(maxScoreData.color);
        canvas.write(`${maxScoreData.name}: ${maxScoreData.points}`, 80, 20);
        canvas.setFillColor();

        canvas.write(`Enemies: ${enemies}`, 200, 20);

        canvas.write(`Your score:`, 5, 50);
        canvas.write(`${data.points}`, 5, 60);

        canvas.write(`Bullet CD:`, 5, 80);
        canvas.write(`${data.bulletCooldown}`, 5, 90);

        canvas.write(`Speed:`, 5, 110);
        canvas.write(`${data.velocity}`, 5, 120);

        canvas.write(`Weapon:`, 5, 140);
        canvas.write(`${data.weapon.name}`, 5, 150);

        canvas.write(`Bullets:`, 5, 170);
        canvas.write(`${data.maxBullets}`, 5, 180);

        canvas.write(`Bullet Speed:`, 5, 200);
        canvas.write(`${data.bulletSpeed}`, 5, 210);

        canvas.draw(0, 410, dimensions.startX, 25, data.color);

        canvas.write(`Name:`, 5, 420);
        canvas.write(`${data.name}`, 5, 430);

        canvas.write(`Health:`, 5, 450);
        canvas.write(`${data.currentHealth}/${data.maxHealth}`, 5, 460);
    }
}
