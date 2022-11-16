<template>
  <div class="snake-core-foods">
    <div
      class="food gift-img gift-frame gift-1"
      :style="getStyle(food)"
      v-for="food in foods"
      :key="food.id"
    ></div>
  </div>
</template>

<script>
import { mapState } from 'vuex';

export default {
  name: 'SnakeCoreFoods',
  props: {
    spacing: {
      type: Number,
      default: 10,
    },
  },
  computed: {
    ...mapState('snake', ['foods']),
  },
  methods: {
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
.snake-core-foods {
  position: absolute;
  top: 0;
  right: 0;
  bottom: 0;
  left: 0;

  .food {
    position: absolute;
    width: 20px;
    height: 20px;
    transform: translate(-50%, -50%);
    overflow: hidden;
  }
  .gift-frame {
    background-size: cover;
    background-repeat: no-repeat;
    image-rendering: crisp-edges;
  }
}
</style>