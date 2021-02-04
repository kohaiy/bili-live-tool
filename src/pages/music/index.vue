<template>
  <div class="music">
    <audio ref="audio"></audio>
    <!-- 播放控制条 -->
    <div class="audio-controls">
      <div class="process-bar" :style="{ width: `${processPercent}%` }"></div>
      <div class="play-btn" @click="handlePlayBtnClick">
        <i :class="`el-icon-video-${isPlaying ? 'pause' : 'play'}`"></i></div>
      <div class="time">{{ audioInfo.currentTime | formatTime }}/{{ audioInfo.duration | formatTime }}</div>
      <div class="volume" ref="volume" @click="handleVolumeClick">
        <div class="volume-value">音量 {{ volumePercent }}%</div>
        <div class="volume-inner" :style="{ width: `${volumePercent}%` }"></div>
      </div>
    </div>
    <div class="action-btn">
      <!--      <div class="show-more-btn"><i class="el-icon-s-operation"></i></div>-->
      <el-button @click="handleNext" type="primary" size="mini">切歌</el-button>
      <el-button @click="handleClear" type="warning" size="mini">清空</el-button>
      <el-button @click="handleClose" type="danger" size="mini">关闭</el-button>
    </div>
    <div v-if="playing" class="playing">正在播放 - {{ playing.name }} - {{
        playing.artists.map(({ name }) => name).join(',')
      }}<span class="el-icon-scissors next-song">{{nextCount.size}}/{{MAX_NEXT_TOTAL}}</span>
    </div>
    <ul class="song-list">
      <li class="song-item" @click="handleClickSong(i)" v-for="(it, i) in songs" :key="it.id">
        <span class="uname">{{ it.uname }}</span>
        <span class="action">点了首</span>
        <span class="song-name">[ {{ it.name }} ]</span>
      </li>
      <li class="songs-empty" v-if="!songs.length">暂无点歌信息<br>赶快发送 "点歌 + 空格 + 歌名" 点歌吧</li>
    </ul>
  </div>
</template>

<script>
import { remote, ipcRenderer } from 'electron';
import NeteaseCloudUtil from '@/utils/netease-cloud.util';

export default {
  name: 'Music',
  data() {
    return {
      isPlaying: false,
      playing: null,
      songs: [],
      audioInfo: {
        duration: 0,
        currentTime: 0,
        volume: 1,
      },
      // 切歌统计
      nextCount: new Set(),
      MAX_NEXT_TOTAL: 5,
    };
  },
  computed: {
    // 进度条百分比
    processPercent() {
      return Math.round((this.audioInfo.currentTime / this.audioInfo.duration) * 100) || 0;
    },
    volumePercent() {
      return Math.round(this.audioInfo.volume * 100) || 0;
    },
  },
  created() {
    ipcRenderer.on('NEXT_SONG', (event, uname) => {
      this.nextCount.add(uname);
      if (this.nextCount.size >= this.MAX_NEXT_TOTAL) {
        this.play();
      }
    });
  },
  mounted() {
    this.play();
    // 每隔一秒读取缓存里面有没有新的歌要点
    setInterval(() => {
      const song = JSON.parse(localStorage.getItem('NEW_SONG') || 'null');
      if (song) {
        localStorage.setItem('NEW_SONG', 'null');
        // 读取到歌曲，调用添加到方法
        this.handleAddSong(song);
      }
    }, 1000);
    // 监听歌曲状态
    this.$refs.audio.addEventListener('play', () => {
      this.isPlaying = true;
    });
    this.$refs.audio.addEventListener('pause', () => {
      this.isPlaying = false;
    });
    // 监听音量改变
    this.$refs.audio.addEventListener('volumechange', () => {
      this.audioInfo.volume = this.$refs.audio.volume;
    });
    // 监听歌曲结束，切歌
    this.$refs.audio.addEventListener('ended', this.handleAudioEnded);
    this.$refs.audio.addEventListener('timeupdate', () => {
      this.audioInfo.currentTime = this.$refs.audio.currentTime;
    });
  },
  beforeDestroy() {
    this.$refs.audio && this.$refs.audio.removeEventListener('ended', this.handleAudioEnded);
  },
  filters: {
    formatTime(seconds) {
      const minutes = Math.floor(seconds / 60);
      return minutes + ':' + ('0' + Math.round(seconds % 60)).substr(-2);
    },
  },
  methods: {
    // 播放/暂停
    handlePlayBtnClick() {
      if (this.$refs.audio) {
        if (this.isPlaying) {
          this.$refs.audio.pause();
        } else {
          this.$refs.audio.play();
        }
      }
    },
    // 调整音量
    handleVolumeClick(event) {
      const { width } = this.$refs.volume.getBoundingClientRect();
      this.$refs.audio.volume = Math.max(0, Math.min(1, event.offsetX / width));
    },
    // 切歌
    handleNext() {
      this.play();
    },
    // 清空歌单
    handleClear() {
      this.songs = [];
    },
    handleAudioEnded() {
      this.play();
    },
    // 往歌单中添加歌曲
    handleAddSong(song) {
      // 判断歌单是否达到上限
      if (this.songs.length < 100) {
        // 判断歌单中是否已有该歌曲
        if (!this.songs.some(({ id }) => id === song.id)) {
          this.songs.push(song);
          console.log(song);
          // 如果不在播放，则调用 play 播放
          if (!this.playing) {
            this.play();
          }
        }
      }
    },
    // 播放歌曲
    async play() {
      this.nextCount = new Set();
      this.$nextTick(async () => {
        // 判断歌单是否有歌，且组件已就绪
        if (this.songs.length && this.$refs.audio) {
          try {
            // 取出歌单中的第一首
            this.playing = this.songs.shift();
            const { id } = this.playing;
            this.$refs.audio.src = `https://music.163.com/song/media/outer/url?id=${id}.mp3`;
            // 开始播放
            await this.$refs.audio.play();
            // 保存歌曲时长
            this.audioInfo.duration = this.$refs.audio.duration;
          } catch (e) {
            console.log(e);
            this.$message({
              type: 'error',
              message: '哦欧，播放失败了，可能是没版权吧～',
              duration: 1500,
            });
            // 播放失败后，播放下一首
            setTimeout(() => {
              this.play();
            });
          }
        } else {
          // 清空正在播放的歌曲
          this.playing = null;
          this.$refs.audio.src = '';
          // 获取随机歌曲
          await this.getRandomSong();
        }
      });
    },
    // 获取热门歌单中的随机歌曲
    async getRandomSong() {
      const trackIds = await NeteaseCloudUtil.getHotList();
      if (trackIds) {
        const { id } = trackIds[Math.floor(Math.random() * trackIds.length)];
        const song = await NeteaseCloudUtil.getSongDetail(id);
        this.handleAddSong(song);
      }
    },
    // 点击删除歌曲
    handleClickSong(index) {
      console.log(index);
      // 先不要了
      // this.songs.splice(index, 1);
    },
    handleClose() {
      remote.getCurrentWindow().close();
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

.music {
  display: flex;
  flex-direction: column;
  width: 100%;
  height: 100vh;
  //padding: 20px;
  -webkit-app-region: drag;

  .audio-controls {
    position: relative;
    display: flex;
    align-items: center;
    min-height: 40px;
    height: 40px;
    padding: 0 10px;
    color: #eeeeee;
    border-radius: 0;
    background-color: transparent;
    overflow: hidden;
    transition: all .3s;
    -webkit-app-region: no-drag;

    .process-bar {
      position: absolute;
      bottom: 0;
      left: 0;
      height: 4px;
      background-color: #1979ec;
      transition: all .3s;

      &::after {
        content: '';
        position: absolute;
        top: 0;
        right: 0;
        bottom: 0;
        width: 20px;
        background: linear-gradient(to right, rgba(255, 255, 255, 0), rgba(255, 255, 255, .2));
      }
    }

    .play-btn {
      position: relative;
      margin-right: 10px;
      font-size: 20px;
      cursor: pointer;
      transition: all .3s;
      opacity: 0;

      &:hover {
        transform: scale(1.5);
        color: #ffffff;
      }
    }

    .time {
      position: relative;
      font-size: 14px;
      text-shadow: 0 0 4px #42b983;
    }

    .volume {
      position: relative;
      flex: 1;
      align-self: flex-end;
      height: 50%;
      margin-left: 20px;
      background-color: #333333;
      cursor: pointer;
      transform: translateY(100%);
      opacity: 0;
      transition: all .3s;

      .volume-value {
        position: absolute;
        top: 0;
        right: 0;
        bottom: 0;
        left: 0;
        display: flex;
        justify-content: center;
        align-items: center;
        font-size: 12px;
        pointer-events: none;
      }

      .volume-inner {
        height: 100%;
        background-color: #ff4d51;
      }
    }

    &:hover {
      border-radius: 5px;
      background-color: #666666;

      .process-bar {
        bottom: 0;
        height: 100%;
      }

      .play-btn {
        opacity: 1;
      }

      .volume {
        transform: translateY(0);
        opacity: 1;
      }
    }
  }

  .playing {
    position: relative;
    bottom: -12px;
    height: 0;
    //margin-top: 20px;
    text-align: center;
    font-size: 14px;
    color: #cccccc;
    text-shadow: 0 0 10px #ff4d51;
    //background-color: rgba(0, 0, 0, .8);

    .next-song {
      margin-left: 5px;
      color: #ff4d51;
    }
  }

  .action-btn {
    display: flex;
    justify-content: flex-end;
    margin-top: 20px;

    .show-more-btn {
      font-size: 18px;
      color: #ffffff;
    }

    .el-button {
      //visibility: hidden;
    }
  }

  .song-list {
    flex: 1;
    margin-top: 4px;
    padding: 24px 16px 16px;
    border-radius: 5px;
    overflow: auto;
    background-color: rgba(0, 0, 0, .8);

    .song-item {
      position: relative;
      list-style: none;
      cursor: pointer;

      .uname {
        font-size: 12px;
        color: #3a8ee6;
      }

      .action {
        margin: 0 8px 0 4px;
        font-size: 12px;
        color: #aaaaaa;
      }

      .song-name {
        font-size: 12px;
        color: #ffffff;
      }

      .remove-btn {
        display: none;
        margin-left: 10px;
      }

      + .song-item {
        margin-top: 4px;
      }

      &::after {
        content: '';
        position: absolute;
        top: 0;
        left: 0;
        right: 0;
        bottom: 50%;
        display: flex;
        justify-content: flex-end;
        border-bottom: 2px dashed #ff4d51;
        color: #ff4d51;
        //transform: translateY(100%);
        //visibility: hidden;
        opacity: 0;
        transition: all .3s;
      }

      &:hover {
        &::after {
          //visibility: visible;
          //transform: translateY(0);
          //opacity: 1;
        }
      }
    }

    .songs-empty {
      list-style: none;
      margin-top: 10px;
      text-align: center;
      color: #eeeeee;
    }
  }
}
</style>