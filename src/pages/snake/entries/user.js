export default class User {
    uid = '';
    name = '';
    face = '';
    score = 0;
    position = {
        x: 0,
        y: 0,
    };
    _events = [];
    constructor({
        uid,
        name,
        face,
        score = 0,
        position = {
            x: 0,
            y: 0,
        },
    }) {
        this.uid = uid;
        this.name = name;
        this.face = face;
        this.score = score;
        this.position = position;
    }
    get isEventEmpty() {
        return !this._events.length;
    }
    pushSteps(steps = []) {
        // 上10左10
        // {event: () => void, steps: 10}
        steps.forEach(s => {
            this._events.push([
                () => (this.position.y -= 1),
                () => (this.position.y += 1),
                () => (this.position.x -= 1),
                () => (this.position.x += 1),
            ][s]);
        });
    }
    nextStep() {
        if (this._events.length) {
            const evt = this._events.shift();
            evt();
        }
    }
}