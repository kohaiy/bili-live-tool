<template>
  <div class="snake-core-users" ref="wrapper">
    <!--    <div-->
    <!--      class="user"-->
    <!--      ref="userEl"-->
    <!--      :class="getClasses(user)"-->
    <!--      :style="getStyle(user)"-->
    <!--      :data-name="user.name"-->
    <!--      v-for="user in users"-->
    <!--      :key="user.uid"-->
    <!--    >-->
    <!--      <snake-head :pic="user.face" :name="user.name" />-->
    <!--    </div>-->
  </div>
</template>
<script>
// import { mapState } from 'vuex';
// import BiliApiUtil from '@/utils/bili-api.util';
// import SnakeHead from '../snake-head.vue';
import Snake from '../../../entries/snake';

export default {
  // components: { SnakeHead },
  name: 'SnakeCoreUsers',
  props: {
    spacing: {
      type: Number,
      default: 10,
    },
  },
  data() {
    return {
      snake: undefined,
      // users: [],
      // userMap: new Map(),
      // steps: new Map(),
    };
  },
  computed: {
    // ...mapState('snake', ['now', 'size']),
  },
  created() {
    // this.$bus.$on('setSteps', async ({ uid, steps }) => {
    //   this.appendUser(uid);
    //   console.log(uid, steps);
    //   this.steps.set(uid, steps);
    //   console.log(this.steps.get(uid));
    // });
    // this.$bus.$on('show', ({ uid }) => {
    //   console.log(uid);
    //   this.appendUser(uid);
    //   console.log(this.users, this.userMap, this.steps);
    //   console.log(this.$refs.userEl);
    // });
    // setInterval(() => {
    //   this.updateStep();
    // }, 1000);
  },
  mounted() {
    this.snake = new Snake(this.$refs.wrapper);
    this.$bus.$emit('setSnake', this.snake);
    setInterval(() => {
      this.snake.generateFood();
    }, 2000);
    // this.snake.pushSteps(24731556, [1, 3, 1, 3, 1, 3, 1, 3]);
    // this.snake.pushSteps(24731556, [1, 3, 1, 3, 1, 3, 1, 3]);
    // this.snake.pushSteps(24731556, [3, 3, 1, 2, 3, 1, 3, 1, 3]);
    // this.snake.pushSteps(24731556, [3, 3, 1, 2, 3, 1, 3, 1, 3]);
    // this.snake.pushSteps(24731556, [1, 1, 2, 3, 1, 3, 1, 3, 1, 3]);
  },
  methods: {
    // getClasses({ lastTime, isCross }) {
    //   // const timeDelta = this.now - lastTime;
    //   const classes = [];
    //   // if (timeDelta >= 30000) {
    //   //   classes.push('hidden');
    //   // }
    //   // if (timeDelta <= 5000) {
    //   //   classes.push('is-active');
    //   // }
    //   // if (isCross) {
    //   //   classes.push('is-cross');
    //   // }
    //   return classes;
    // },
    // getStyle({ position }) {
    //   return {
    //     top: `${(position.y + 0.5) * this.spacing}px`,
    //     left: `${(position.x + 0.5) * this.spacing}px`,
    //   };
    // },
    // async appendUser(uid) {
    //   if (this.userMap.has(uid)) {
    //     return this.userMap.get(uid);
    //   }
    //   const res = await BiliApiUtil.getUserInfo(uid);
    //   if (res) {
    //     const index = this.users.length;
    //     const { name, face } = res;
    //     const user = {
    //       index,
    //       uid,
    //       name,
    //       face,
    //       score: 0,
    //       position: {
    //         x: Math.floor(Math.random() * (this.size.cols - 1)),
    //         y: Math.floor(Math.random() * (this.size.rows - 1)),
    //       },
    //     };
    //     this.userMap.set(uid, user);
    //     this.users.push(user);
    //     return user;
    //   }
    // },
    // updateStep() {
    //   [...this.steps.keys()].forEach((uid) => {
    //     const steps = this.steps.get(uid);
    //     if (!steps.length) {
    //       return this.steps.delete(uid);
    //     }
    //     const user = this.userMap.get(uid);
    //     const s = steps.shift();
    //     // s 是 0 到 3，也可以用switch去case，因为是有序的，所以直接用数组来弄
    //     // 数组的每个元素是函数，通过下标拿到后执行
    //     [
    //       () => (user.position.y -= 1),
    //       () => (user.position.y += 1),
    //       () => (user.position.x -= 1),
    //       () => (user.position.x += 1),
    //     ][s]();
    //     if (user.position.y > this.size.rows) {
    //       user.position.y = 0;
    //     }
    //     if (user.position.y < 0) {
    //       user.position.y = this.size.rows;
    //     }
    //     if (user.position.x > this.size.cols) {
    //       user.position.x = 0;
    //     }
    //     if (user.position.x < 0) {
    //       user.position.x = this.size.cols;
    //     }
    //   });
    // },
  },
};
</script>

<style lang="scss">
.snake-core-users {
  position: relative;
  width: 100%;
  height: 100%;
  overflow: hidden;

  .snake-user {
    position: absolute;
    display: flex;
    font-size: 24px;
    border-radius: 50%;
    border: 2px solid #fff;
    transform: translate(-50%, -50%);

    &::after {
      content: attr(data-name);
      position: absolute;
      font-size: 12px;
      top: 0;
      left: 12px;
      height: 20px;
      line-height: 20px;
      padding: 0 4px;
      transform: translateX(-50%);
      word-break: keep-all;
      white-space: nowrap;
      border-radius: 4px;
      color: rgb(6, 209, 74);
      background-color: rgba(0, 0, 0, 0.8);
      opacity: 0;
      transition: all 0.2s;
      // border: 1px solid rgb(6, 209, 74);
    }

    img {
      width: 100%;
      height: 100%;
      border-radius: 50%;
    }

    &.is-active {
      border-color: rgb(6, 209, 74);

      &::after {
        top: -20px;
        opacity: 1;
      }
    }

    &.hidden {
      opacity: 0;
    }

    &.is-cross {
      transition-delay: 0s;
    }
  }
}
</style>