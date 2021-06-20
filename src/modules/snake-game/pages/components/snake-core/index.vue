<template>
  <div class="snake-core" ref="snakeCore">
    <div class="is-loaded" v-if="isLoaded">
      <snake-core-bg :spacing="container.spacing" />
      <snake-core-foods :spacing="container.spacing" />
      <snake-core-users :spacing="container.spacing" />
    </div>
    <div class="is-unload" v-else>
      <span>加载中……</span>
    </div>
  </div>
</template>

<script>
import { mapMutations } from 'vuex';
import SnakeCoreBg from './snake-core-bg';
import SnakeCoreUsers from './snake-core-users';
import SnakeCoreFoods from './snake-core-foods';

let resizeTimer;
let snake;
export default {
  components: { SnakeCoreBg, SnakeCoreUsers, SnakeCoreFoods },
  name: 'SnakeCore',
  data() {
    return {
      isLoaded: false,
      container: {
        width: 0,
        height: 0,
        spacing: 20,
      },
    };
  },
  computed: {},
  created() {
    this.$bus.$on('setSnake', s => snake = s);
  },
  mounted() {
    this.isLoaded = true;
    this.getContainerSize();
    window.addEventListener('resize', this.handleWindowResize);
  },
  beforeDestroy() {
    window.removeEventListener('resize', this.handleWindowResize);
  },
  methods: {
    ...mapMutations('snake', ['setSize']),
    getContainerSize() {
      snake && snake.calcSize();
      const { width, height } = this.$refs.snakeCore.getBoundingClientRect();
      this.container.width = width;
      this.container.height = height;
      this.setSize({
        rows: Math.ceil(height / this.container.spacing),
        cols: Math.ceil(width / this.container.spacing),
      });
    },
    handleWindowResize() {
      // 防抖
      clearTimeout(resizeTimer);
      resizeTimer = setTimeout(() => {
        this.getContainerSize();
      }, 200);
    },
  },
};
</script>

<style lang="scss" scoped>
.snake-core {
  width: 100%;
  height: 100%;
  color: #fff;
  overflow: hidden;

  .is-loaded {
    position: relative;
    width: 100%;
    height: 100%;
  }
}
</style>