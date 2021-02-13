<template>
  <div class="draw-game">
    <div class="action-btn" @click="isLocked = !isLocked">
      <i :class="`el-icon-${isLocked ? 'lock' : 'unlock'}`"></i>
    </div>
    <div class="move-btn" @click="isLocked = !isLocked">
      <i class="el-icon-rank"></i>
    </div>
    <canvas
        ref="canvas"
        @mouseenter="handleMouseEnter"
        @mousemove="handleMouseEnter"
        @mouseleave.prevent="handleMouseLeave"
        @dblclick.prevent="handleClose"
        :width="size.width"
        :height="size.height"
    ></canvas>
  </div>
</template>

<script>
import { ipcRenderer, remote } from 'electron';

let timer;
export default {
  name: 'DrawGame',
  data() {
    return {
      isLocked: false,
      size: {
        width: window.innerWidth,
        height: window.innerHeight,
      },
      info: {
        // 线条的间隔，即格子的大小
        seq: 20,
      },
    };
  },
  computed: {
    rows() {
      return Math.floor(this.size.height / this.info.seq);
    },
    cols() {
      return Math.floor(this.size.width / this.info.seq);
    },
  },
  mounted() {
    this.draw();
    window.addEventListener('resize', this.handleWindowResize);
    ipcRenderer.on('DRAW_POINT', (event, info) => {
      const [x, y, color] = info.trim().replace('＃', '#').split(/[,，\s]/);
      this.drawPoint(x, y, color);
    });
  },
  beforeDestroy() {
    window.removeEventListener('resize', this.handleWindowResize);
  },
  methods: {
    draw() {
      const $canvas = this.$refs.canvas;
      const ctx = $canvas.getContext('2d');
      //   ctx.fillStyle = "rgba(255, 255, 255, .1)";
      //   ctx.fillRect(0, 0, this.size.width, this.size.height);
      ctx.strokeStyle = 'rgba(0, 0, 0, .1)';
      for (let i = 0; i < this.size.width; i += this.info.seq) {
        ctx.beginPath();
        ctx.moveTo(i, 0);
        ctx.lineTo(i, this.size.height);
        ctx.stroke();
      }
      for (let i = 0; i < this.size.height; i += this.info.seq) {
        ctx.beginPath();
        ctx.moveTo(0, i);
        ctx.lineTo(this.size.width, i);
        ctx.stroke();
      }
    },
    drawPoint(x, y, color) {
      if (x >= 0 && x <= this.cols && y >= 0 && y <= this.rows) {
        const $canvas = this.$refs.canvas;
        const ctx = $canvas.getContext('2d');
        const realX = x * this.info.seq;
        const realY = y * this.info.seq;
        ctx.fillStyle = color;
        ctx.fillRect(realX, realY, this.info.seq, this.info.seq);
      }
    },
    handleWindowResize() {
      clearTimeout(timer);
      timer = setTimeout(() => {
        this.size.width = window.innerWidth;
        this.size.height = window.innerHeight;
        this.$nextTick(() => {
          this.draw();
        });
      }, 500);
    },
    handleMouseEnter() {
      console.log('handleMouseEnter');
      if (this.isLocked) {
        remote.getCurrentWindow().setIgnoreMouseEvents(true, { forward: true });
      }
    },
    handleMouseLeave() {
      if (this.isLocked) {
        remote.getCurrentWindow().setIgnoreMouseEvents(false);
      }
    },
    toggleMouseIgnore() {
      remote
          .getCurrentWindow()
          .setMouseIgnore(!remote.getCurrentWindow().isMouseIgnore, {
            forward: true,
          });
    },
    handleClose() {
      remote.getCurrentWindow().close();
    },
  },
};
</script>

<style lang="scss">
@import "../../theme/common";

.draw-game {
  position: relative;
  width: 100%;
  height: 100vh;
  background-color: rgba(0, 0, 0, 0);
  // -webkit-app-region: drag;

  .action-btn,
  .move-btn {
    position: absolute;
    right: 0;
    top: 0;
    font-size: 20px;
    color: rgb(245, 135, 135);
    cursor: pointer;
    -webkit-app-region: no-drag;
  }

  .move-btn {
    right: 30px;
    color: #cccccc;
    -webkit-app-region: drag;
    &:hover {
      color:  rgb(245, 135, 135);
    }
  }
}
</style>