import User from './user';
import Food from './food';

export default class Snake {
    deltaTime = 1000;
    spacing = 20;
    users = [];
    foods = [];
    cols = 0;
    rows = 0;
    _userMap = {};
    _foodMap = {};
    _container;

    constructor(container) {
        this._container = container;
        this.calcSize();
    }

    calcSize() {
        const { width, height } = this._container.getBoundingClientRect();
        this.cols = Math.floor(width / this.spacing);
        this.rows = Math.floor(height / this.spacing);
    }

    show(uid) {
        let user = this._userMap[uid];
        if (!user) {
            user = new User(this, uid);
            this.users.push(user);
            this._userMap[uid] = user;
            user.render(this._container);
        }
        user.show();
    }

    speak(uid, message) {
        let user = this._userMap[uid];
        if (!user) {
            user = new User(this, uid);
            this.users.push(user);
            this._userMap[uid] = user;
            user.render(this._container);
        }
        user.speak(message);
    }

    pushSteps(uid, steps) {
        let user = this._userMap[uid];
        if (!user) {
            user = new User(this, uid);
            this.users.push(user);
            this._userMap[uid] = user;
            user.render(this._container);
        }
        user.pushSteps(steps);
    }

    check(user) {
        const food = this._foodMap[`${user.position.x},${user.position.y}`];
        if (food) {
            const i = this.foods.indexOf(food);
            console.log(i, this.foods, this._foodMap);
            user.score += food.score;
            this.foods.splice(i, 1);
            delete this._foodMap[`${user.position.x},${user.position.y}`];
            this.sort();
        }
    }

    generateFood() {
        const food = new Food();
        food.randomPosition(this.cols, this.rows);
        let i = 0;
        while (i < 10 && this._foodMap[`${food.position.x},${food.position.y}`]) {
            food.randomPosition(this.cols, this.rows);
            i++;
        }
        if (i < 10) {
            this.foods.push(food);
            this._foodMap[`${food.position.x},${food.position.y}`] = food;
        }
    }

    sort() {
        this.users.sort((u1, u2) => u2.score - u1.score);
    }
}