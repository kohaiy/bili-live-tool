<template>
  <div class="snake-game">
    <snake-side/>
    <snake-main/>
  </div>
</template>

<script>
import { ipcRenderer } from 'electron';
import SnakeSide from './components/snake-side';
import SnakeMain from './components/snake-main';
import BiliApiUtil from '@/utils/bili-api.util';

let snake;
export default {
  name: 'SnakeGame',
  components: { SnakeSide, SnakeMain },
  created() {
    this.$bus.$on('setSnake', (s) => snake = s);
    ipcRenderer.on('SNAKE_ACTION', (event, { uid, message }) => {
      console.log(uid, message);
      this.addMessage(uid, message);
    });
  },
  methods: {
    async addMessage(uid, message) {
      // // 判断是否已加入
      // if (!this.userMap[uid]) {
      //   // 获取用户信息
      //   const res = await BiliApiUtil.getUserInfo(uid);
      //   if (res) {
      //     const { name, face } = res;
      //     this.pushUser({
      //       uid,
      //       name,
      //       face,
      //     });
      //   }
      // } else {
      //   this.pushUser({ uid });
      // }
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
        // this.$bus.$emit('setSteps', { uid, steps });
        snake.pushSteps(uid, steps);
      } else if (message.trim().toUpperCase() === 'S') {
        // do nothing
        // this.$bus.$emit('show', { uid });
        snake.show(uid);
      } else {
        snake.speak(uid, message.replace(/^s\s*/i, ''));
        // this.setUserPosition({
        //   uid,
        //   x: 0,
        //   y: 0,
        // });
      }
    },
  },
};
</script>

<style lang="scss">
@import '../../../theme/common.scss';

.snake-game {
  width: 100%;
  height: 100vh;
  display: flex;
}
</style>