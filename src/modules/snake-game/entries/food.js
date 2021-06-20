export default class Food {
    id = 0;
    score = 1;
    position = {
        x: 1,
        y: 1,
    };

    constructor(score = 1) {
        this.score = score;
        this.id = `${Date.now()}${Math.round(Math.random() * 9999)}`;
    }

    randomPosition(cols, rows) {
        this.position.x = Math.floor(Math.random() * (cols - 2) + 1);
        this.position.y = Math.floor(Math.random() * (rows - 2) + 1);
    }
}