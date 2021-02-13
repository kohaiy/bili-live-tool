<template>
  <div class="snake-core-bg">
    <div class="row" v-for="(row, rowIndex) in size.rows" :key="rowIndex">
      <div
        class="cell"
        :style="cellStyle"
        v-for="(col, colIndex) in size.cols"
        :key="colIndex"
      ></div>
    </div>
    <div class="footer">{{ size.cols }} x {{ size.rows }}</div>
  </div>
</template>

<script>
import { mapState } from 'vuex';

export default {
  name: 'SnakeCoreBg',
  props: {
    spacing: {
      type: Number,
      default: 10,
    },
  },
  computed: {
    ...mapState('snake', ['size']),
    cellStyle() {
      return {
        width: `${this.spacing}px`,
        height: `${this.spacing}px`,
        minWidth: `${this.spacing}px`,
        minHeight: `${this.spacing}px`,
      };
    },
  },
};
</script>

<style lang="scss" scoped>
.snake-core-bg {
  position: absolute;
  top: 0;
  left: 0;
  display: flex;
  flex-direction: column;
  // align-items: center;
  // justify-content: center;
  width: 100%;
  height: 100%;
  .row {
    display: flex;
    .cell {
      border-left: 1px solid rgba(255, 0, 255, 0.05);
      border-top: 1px solid rgba(255, 0, 255, 0.05);
      overflow: hidden;

      &:nth-child(5n + 1) {
        // border-left-width: 2px;
        border-left-color: rgba(255, 0, 255, 0.1);
      }
    }

    &:nth-child(5n + 1) {
      .cell {
        // border-top-width: 2px;;
        border-top-color: rgba(255, 0, 255, 0.1);
      }
    }
  }
  .footer {
    position: absolute;
    right: 0;
    bottom: 0;
    padding: 0 4px;
    font-size: 12px;
    color: rgba(255, 255, 255, 0.4);
    background-color: rgba(0, 0, 0, .8);
  }
}
</style>