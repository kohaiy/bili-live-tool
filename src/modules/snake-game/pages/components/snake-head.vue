<template>
  <div class="snake-head">
    <div class="text" v-if="text">{{ text }}</div>
    <img :src="pic" alt="" v-else/>
  </div>
</template>

<script>
export default {
  name: 'SnakeHead',
  props: {
    pic: {},
    name: {},
  },
  computed: {
    text() {
      if (!this.pic || this.pic.includes('noface')) {
        return this.name[0].toUpperCase();
      }
      return '';
    },
  },
};
</script>

<style lang="scss" scoped>
.snake-head {
  position: relative;
  display: flex;
  width: 1em;
  height: 1em;
  border-radius: 50%;
  overflow: hidden;

  img {
    width: 100%;
    height: 100%;
  }

  .text {
    position: absolute;
    top: 0;
    right: 0;
    bottom: 0;
    left: 0;
    display: flex;
    justify-content: center;
    align-items: center;
    font-size: 0.6em;
    font-weight: bold;
    vertical-align: middle;
    color: #fff;
    background-color: #f45a8d;
    // background-color: rgba(0, 0, 0, .4);
  }
}
</style>