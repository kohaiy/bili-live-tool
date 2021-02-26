<template>
  <div class="snake">
    <snake-side />
    <snake-main />
  </div>
</template>

<script>
import { ipcRenderer } from 'electron';
import { mapState, mapMutations } from 'vuex';
import BiliApiUtil from '@/utils/bili-api.util';
import SnakeMain from './components/snake-main';
import SnakeSide from './components/snake-side';

export default {
  name: 'Snake',
  components: { SnakeSide, SnakeMain },
  computed: {
    ...mapState('snake', ['users', 'userMap', 'size']),
  },
  async created() {
    ipcRenderer.on('SNAKE_ACTION', (event, { uid, message }) => {
      console.log(uid, message);
      this.addMessage(uid, message);
    });
    // this.randomMessage();
    // setInterval(() => {
    //   this.updateNow();
    //   // this.genFood();
    // }, 1000);
    setInterval(() => {
      this.genFood();
    }, 10000);

    setInterval(() => {
      this.updateStep();
    }, 300);
  },
  methods: {
    ...mapMutations('snake', [
      'pushUser',
      'updateNow',
      'setUserPosition',
      'setSteps',
      'updateStep',
      'genFood',
    ]),
    randomMessage() {
      this.addMessage(Math.round(Math.random() * 20 + 24731556 - 10), '');
      setTimeout(
        () => this.randomMessage(),
        Math.round(Math.random() * 5) * 1000
      );
    },
    async addMessage(uid, message) {
      // 判断是否已加入
      if (!this.userMap[uid]) {
        // 获取用户信息
        const res = await BiliApiUtil.getUserInfo(uid);
        if (res) {
          const { name, face } = res;
          this.pushUser({
            uid,
            name,
            face,
          });
        }
      } else {
        this.pushUser({ uid });
      }
      // 切割提取信息
      let steps = message.match(/[上下左右]\d*/g);
      console.log(steps);
      if (steps && steps.length) {
        steps = steps.reduce((a, b) => {
          const direction = '上下左右'.indexOf(b[0]);
          const count = +b.substr(1) || 1;
          a.push(...new Array(count).fill(direction));
          return a;
        }, []);
        console.log(steps);
        // this.setSteps({ uid, steps });
        this.$bus.$emit('setSteps', { uid, steps });
      } else if (message.trim().toUpperCase() === 'S') {
        // do nothing
        this.$bus.$emit('show', { uid });
      } else {
        this.setUserPosition({
          uid,
          x: 0,
          y: 0,
        });
      }
    },
  },
};
</script>

<style lang="scss">
@import '../../theme/common.scss';

.snake {
  width: 100%;
  height: 100vh;
  display: flex;
}
</style>