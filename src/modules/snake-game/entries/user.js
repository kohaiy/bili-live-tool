import BiliApiUtil from '@/utils/bili-api.util';

export default class User {
    uid = '';
    name = '';
    face = '';
    score = 0;
    position = {
        x: 1,
        y: 1,
    };
    _el;
    _ctx;
    _steps = [];
    _inactiveTimer = null;
    _hiddenTimer = null;
    _speakTimer = null;

    constructor(ctx, uid) {
        this._ctx = ctx;
        this.uid = uid;
        this.name = 'test';
        this.face = 'face';
        this._el = document.createElement('div');
        this._el.classList.add('snake-user');
        this.position.x = Math.round(Math.random() * this._ctx.cols);
        this.position.y = Math.round(Math.random() * this._ctx.rows);
        this.updateStyle();
        this.update();
        this.getUserInfo().catch(console.log);
    }

    get deltaTime() {
        return (this._ctx && this._ctx.deltaTime) || 1000;
    }

    get spacing() {
        return (this._ctx && this._ctx.spacing) || 10;
    }

    update() {
        this.nextStep();
        setTimeout(() => {
            this.update();
        }, this.deltaTime);
    }

    /**
     * 渲染到画板上
     * @param container{HTMLDivElement}
     */
    render(container) {
        container.appendChild(this._el);
    }

    pushSteps(steps = []) {
        this.updateStyle();
        this._steps = steps.slice(0, 100);
    }

    nextStep() {
        if (this._steps.length) {
            clearTimeout(this._inactiveTimer);
            clearTimeout(this._hiddenTimer);
            this._inactiveTimer = null;
            this._hiddenTimer = null;
            this._el.classList.add('is-active');
            this._el.classList.remove('hidden');
            const s = this._steps.shift();
            ([
                () => (this.position.y -= 1),
                () => (this.position.y += 1),
                () => (this.position.x -= 1),
                () => (this.position.x += 1),
            ][s])();
            let isCross = false;
            if (this.position.y > this._ctx.rows + 1) {
                this.position.y = -1;
                isCross = true;
            }
            if (this.position.y < -1) {
                this.position.y = this._ctx.rows + 1;
                isCross = true;
            }
            if (this.position.x > this._ctx.cols + 1) {
                this.position.x = -1;
                isCross = true;
            }
            if (this.position.x < -1) {
                this.position.x = this._ctx.cols + 1;
                isCross = true;
            }
            this._ctx.check(this);
            this.updateStyle(!isCross);
        } else {
            if (!this._inactiveTimer)
                this._inactiveTimer = setTimeout(() => {
                    this._el.classList.remove('is-active');
                }, 5000);
            if (!this._hiddenTimer)
                this._hiddenTimer = setTimeout(() => {
                    this._el.classList.add('hidden');
                }, 60000);
        }
    }

    updateStyle(hasTransition = true) {
        // this._el.style.position = 'absolute';
        this._el.style.left = `${(this.position.x + 0.5) * this.spacing}px`;
        this._el.style.top = `${(this.position.y + 0.5) * this.spacing}px`;
        this._el.style.width = `${this.spacing * 1.2}px`;
        this._el.style.height = `${this.spacing * 1.2}px`;
        // this._el.style.borderRadius = '50%';
        // this._el.style.backgroundColor = `hsl(${Math.floor(Math.random() * 360)}, 40%, 50%)`;
        this._el.style.backgroundColor = '#fff';
        this._el.style.transition = hasTransition ? 'all .3s' : 'all 0s';
    }

    show() {
        clearTimeout(this._inactiveTimer);
        clearTimeout(this._hiddenTimer);
        this._el.classList.add('is-active');
        this._el.classList.remove('hidden');
        this._inactiveTimer = setTimeout(() => {
            this._el.classList.remove('is-active');
        }, 5000);
        this._hiddenTimer = setTimeout(() => {
            this._el.classList.add('hidden');
        }, 60000);
    }

    speak(message) {
        clearTimeout(this._speakTimer);
        clearTimeout(this._inactiveTimer);
        clearTimeout(this._hiddenTimer);
        this._el.classList.add('is-active');
        this._el.classList.remove('hidden');
        this._el.dataset.name = message;
        this._speakTimer = setInterval(() => {
            this._el.dataset.name = this.name;
        }, 5000);
        this._inactiveTimer = setTimeout(() => {
            this._el.classList.remove('is-active');
        }, 5000);
        this._hiddenTimer = setTimeout(() => {
            this._el.classList.add('hidden');
        }, 60000);
    }

    async getUserInfo() {
        const res = await BiliApiUtil.getUserInfo(this.uid);
        if (res) {
            const { name, face } = res;
            this.name = name;
            this.face = face;
            const img = new Image();
            img.src = face;
            this._el.appendChild(img);
            this._el.dataset.name = name;
            this._el.classList.add('is-active');
        }
    }
}