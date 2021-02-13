<template>
  <div class="snake-core-users">
    <div
      class="user"
      :class="getClasses(user)"
      :style="getStyle(user)"
      :data-name="user.name"
      v-for="user in users"
      :key="user.uid"
    >
      <snake-head :pic="user.face" :name="user.name" />
    </div>
  </div>
</template>
<script>
import { mapState } from 'vuex';
import SnakeHead from '../snake-head.vue';

export default {
  components: { SnakeHead },
  name: 'SnakeCoreUsers',
  props: {
    spacing: {
      type: Number,
      default: 10,
    },
  },
  computed: {
    ...mapState('snake', ['users', 'now']),
  },
  methods: {
    getClasses({ lastTime, isCross }) {
      const timeDelta = this.now - lastTime;
      const classes = [];
      if (timeDelta >= 30000) {
        classes.push('hidden');
      }
      if (timeDelta <= 5000) {
        classes.push('is-active');
      }
      if (isCross) {
        classes.push('is-cross');
      }
      return classes;
    },
    getStyle({ position }) {
      return {
        top: `${(position.y + 0.5) * this.spacing}px`,
        left: `${(position.x + 0.5) * this.spacing}px`,
      };
    },
  },
};
</script>

<style lang="scss" scoped>
.snake-core-users {
  position: relative;
  width: 100%;
  height: 100%;
  overflow: hidden;
  .user {
    position: absolute;
    font-size: 24px;
    border-radius: 50%;
    border: 2px solid #fff;
    transform: translate(-50%, -50%);
    transition: all 0s;
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
      border-radius: 4px;
      color: rgb(6, 209, 74);
      background-color: rgba(0, 0, 0, 0.8);
      opacity: 0;
      transition: all 0.2s;
      // border: 1px solid rgb(6, 209, 74);
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