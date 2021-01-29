<template>
  <div class="home">
    <div class="header">
      <div class="operates">
        <div class="btn on-top"
             :class="{ 'is-active': isOnTop }"
             title="置顶"
             @click="handleOnTopChange">
          <i class="el-icon-aim"></i>
        </div>
        <div class="btn lock"
             :class="{ 'is-active': isLocked }"
             title="锁定"
             @click="isLocked = !isLocked">
          <i :class="`el-icon-${isLocked ? 'lock' : 'unlock'}`"></i>
        </div>
        <div class="btn"
             title="点歌"
             @click="handleOpenMusic">
          <i class="el-icon-headset"></i>
        </div>
        <div class="btn setting"
             title="设置"
             @click="handleSetting">
          <i class="el-icon-setting"></i>
        </div>
        <div class="btn close"
             title="关闭"
             @click="handleClose">
          <i class="el-icon-circle-close"></i>
        </div>
      </div>
      <up-stat-info/>
    </div>
    <div class="message-list--wrapper"
         @mouseenter="handleMouseEnter"
         @mouseleave="handleMouseLeave">
      <live-message-list/>
    </div>
  </div>
</template>

<script>
import {remote} from 'electron';
import IpcRendererUtil from "@/utils/ipc-renderer.util";
import LiveMessageList from '@/components/live-message-list';
import UpStatInfo from '@/components/up-stat-info';

export default {
  name: 'App',
  components: {UpStatInfo, LiveMessageList},
  data() {
    return {
      isLocked: false,
      isOnTop: true,
    };
  },
  mounted() {
    setInterval(() => {
    }, 1000);
  },
  methods: {
    handleClose() {
      remote.getCurrentWindow().close();
    },
    handleOpenMusic() {
      IpcRendererUtil.send('OPEN_MUSIC');
    },
    handleSetting() {
      IpcRendererUtil.send('OPEN_SETTING');
    },
    handleOnTopChange() {
      this.isOnTop = !this.isOnTop;
      remote.getCurrentWindow().setAlwaysOnTop(this.isOnTop);
    },
    handleMouseEnter() {
      if (this.isLocked) {
        remote.getCurrentWindow().setIgnoreMouseEvents(true, {forward: true});
      }
    },
    handleMouseLeave() {
      if (this.isLocked) {
        remote.getCurrentWindow().setIgnoreMouseEvents(false);
      }
    },
  },
};
</script>

<style lang="scss">
* {
  margin: 0;
  padding: 0;
  box-sizing: border-box;

  &::-webkit-scrollbar {
    width: 10px;
  }

  &::-webkit-scrollbar-thumb {
    border-radius: 5px;
    background-color: rgba(255, 255, 255, .1);
  }

  &::-webkit-scrollbar-track {
    background-color: transparent;
  }
}

.home {
  position: relative;
  display: flex;
  flex-direction: column;
  width: 100%;
  height: 100vh;
  overflow: hidden;
  color: #fff;
  /*background-color: #ffffff;*/
  background-color: rgba(0, 0, 0, .8);

  .header {
    -webkit-app-region: drag;
  }

  .operates {
    position: absolute;
    top: 10px;
    right: 20px;
    display: flex;
    align-items: center;
    -webkit-app-region: no-drag;

    .btn {
      font-size: 18px;
      color: #cccccc;
      cursor: pointer;

      &:hover {
        color: #ffffff;
      }

      &.is-active {
        color: #5aacea;
      }

      + .btn {
        margin-left: 10px;
      }

      &.close {
        color: #f56565;
      }
    }
  }

  .up-stat-info {

  }

  .message-list--wrapper {
    flex: 1;
    overflow: auto;
  }
}
</style>

