<template>
  <div
      class="snake-main"
      @mouseenter="handleMouseEnter"
      @mouseleave="handleMouseLeave">
    <snake-core/>
  </div>
</template>

<script>
import { remote } from 'electron';
import SnakeCore from './snake-core';

export default {
  name: 'SnakeMain',
  components: { SnakeCore },
  methods: {
    handleMouseEnter() {
      remote.getCurrentWindow().setIgnoreMouseEvents(true, { forward: true });
    },
    handleMouseLeave() {
      remote.getCurrentWindow().setIgnoreMouseEvents(false);
    },
  },
};
</script>

<style lang="scss" scoped>
.snake-main {
  flex: 1;
  display: flex;
  // background-color: rgba(0, 0, 0, 0.2);
  overflow: auto;
}
</style>