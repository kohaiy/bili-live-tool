import User from '../../pages/snake/entries/user';

function getRandomPosition(rows, cols) {
    const position = {
        x: Math.floor(Math.random() * (cols - 2) + 1),
        y: Math.floor(Math.random() * (rows - 2) + 1),
    };
    return position;
}

const snake = {
    namespaced: true,
    state: {
        users: [],
        userMap: {},
        steps: {},
        foods: [],
        foodPostion: {},
        size: {
            rows: 0,
            cols: 0,
        },
        now: Date.now(),
        activeUsers: [],
    },
    mutations: {
        pushUser(state, user) {
            const { uid } = user;
            if (!state.userMap[uid]) {
                user.score = 0;
                user.position = {
                    x: Math.floor(Math.random() * (state.size.cols - 1)),
                    y: Math.floor(Math.random() * (state.size.rows - 1)),
                };
                user = new User(user);
                state.userMap[uid] = user;
                state.users.push(user);
            }
            // state.userMap[uid].lastTime = Date.now();
        },
        setUserPosition(state, { uid, x, y }) {
            if (state.userMap[uid]) {
                state.userMap[uid].position.x = x;
                state.userMap[uid].position.y = y;
            }
        },
        setSteps(state, { uid, steps }) {
            state.steps[uid] = steps;
        },
        setSize(state, size) {
            state.size = size;
        },
        updateStep(state) {
            Object.keys(state.steps).forEach((uid) => {
                const steps = state.steps[uid];
                const user = state.userMap[uid];
                user.isCross = false;
                const s = steps.shift();
                [
                    () => user.position.y -= 1,
                    () => user.position.y += 1,
                    () => user.position.x -= 1,
                    () => user.position.x += 1,
                ][s]();
                if (user.position.y > state.size.rows) {
                    user.position.y = 0;
                    user.isCross = true;
                }
                if (user.position.y < 0) {
                    user.position.y = state.size.rows;
                    user.isCross = true;
                }
                if (user.position.x > state.size.cols) {
                    user.position.x = 0;
                    user.isCross = true;
                }
                if (user.position.x < 0) {
                    user.position.x = state.size.cols;
                    user.isCross = true;
                }
                const { x, y } = user.position;
                const food = state.foodPostion[`${x},${y}`];
                if (food) {
                    user.score += food.score;
                    const index = state.foods.findIndex(({ id }) => id === food.id);
                    if (index >= 0) {
                        state.foods.splice(index, 1);
                    }
                    delete state.foodPostion[`${x},${y}`];
                }
                state.userMap[uid].lastTime = Date.now();
                if (!steps.length) {
                    delete state.steps[uid];
                }
            });
        },
        updateNow(state) {
            state.now = Date.now();
        },
        genFood(state) {
            if (state.foods.length > 10) {
                return;
            }
            const food = {
                id: Date.now(),
                score: 1,
                position: getRandomPosition(state.size.rows, state.size.cols),
            };
            const { x, y } = food.position;
            state.foodPostion[`${x},${y}`] = food;
            state.foods.push(food);
        },
    },
};

export default snake;
