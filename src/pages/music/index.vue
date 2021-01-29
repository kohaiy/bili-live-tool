<template>
  <div class="music">
    <audio ref="audio"></audio>
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
    <div v-if="playing" class="playing">正在播放 - {{ playing.name }} - {{
        playing.artists.map(({ name }) => name).join(',')
      }}
    </div>
    <div class="action-btn">
      <el-button @click="handleNext" type="primary" size="mini">切歌</el-button>
      <el-button @click="handleClear" type="warning" size="mini">清空</el-button>
      <el-button @click="handleClose" type="danger" size="mini">关闭</el-button>
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
import { remote } from 'electron';
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
  mounted() {
    this.play();
    setInterval(() => {
      const song = JSON.parse(localStorage.getItem('NEW_SONG') || 'null');
      if (song) {
        localStorage.setItem('NEW_SONG', 'null');
        this.handleAddSong(song);
      }
    }, 1000);
    this.$refs.audio.addEventListener('play', () => {
      this.isPlaying = true;
    });
    this.$refs.audio.addEventListener('pause', () => {
      this.isPlaying = false;
    });
    this.$refs.audio.addEventListener('volumechange', () => {
      this.audioInfo.volume = this.$refs.audio.volume;
    });
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
    handlePlayBtnClick() {
      if (this.$refs.audio) {
        if (this.isPlaying) {
          this.$refs.audio.pause();
        } else {
          this.$refs.audio.play();
        }
      }
    },
    handleVolumeClick(event) {
      const { width } = this.$refs.volume.getBoundingClientRect();
      this.$refs.audio.volume = Math.max(0, Math.min(1, event.offsetX / width));
    },
    handleNext() {
      this.play();
    },
    handleClear() {
      this.songs = [];
    },
    handleAudioEnded() {
      this.play();
    },
    handleAddSong(song) {
      if (this.songs.length < 100) {
        if (!this.songs.some(({ id }) => id === song.id)) {
          this.songs.push(song);
          console.log(song);
          if (!this.playing) {
            this.play();
          }
        }
      }
    },
    async play() {
      this.$nextTick(async () => {
        if (this.songs.length && this.$refs.audio) {
          try {
            this.playing = this.songs.shift();
            const { id } = this.playing;
            this.$refs.audio.src = `https://music.163.com/song/media/outer/url?id=${id}.mp3`;
            await this.$refs.audio.play();
            this.audioInfo.duration = this.$refs.audio.duration;
          } catch (e) {
            console.log(e);
            setTimeout(() => {
              this.play();
            });
          }
        } else {
          this.playing = null;
          this.$refs.audio.src = '';
          await this.getRandomSong();
        }
      });
    },
    async getRandomSong() {
      const trackIds = await NeteaseCloudUtil.getHotList();
      if (trackIds) {
        const { id } = trackIds[Math.floor(Math.random() * trackIds.length)];
        const song = await NeteaseCloudUtil.getSongDetail(id);
        this.handleAddSong(song);
      }
    },
    handleClickSong(index) {
      this.songs.splice(index, 1);
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
    border-radius: 5px;
    color: #eeeeee;
    background-color: #666666;
    overflow: hidden;
    -webkit-app-region: no-drag;

    .process-bar {
      position: absolute;
      top: 0;
      left: 0;
      bottom: 0;
      //border-right: 1px solid #ffffff;
      background-color: #1979ec;

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

      &:hover {
        transform: scale(1.5);
        color: #ffffff;
      }
    }

    .time {
      position: relative;
      font-size: 14px;
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
      .volume {
        transform: translateY(0);
        opacity: 1;
      }
    }
  }

  .playing {
    text-align: center;
    font-size: 14px;
    color: #cccccc;
    text-shadow: 0 0 10px #ff4d51;
    background-color: rgba(0, 0, 0, .8);
  }

  .action-btn {
    display: flex;
    justify-content: flex-end;
    margin-top: 20px;
  }

  .song-list {
    flex: 1;
    margin-top: 20px;
    padding: 20px;
    border-radius: 5px;
    overflow: auto;
    background-color: rgba(0, 0, 0, .2);

    .song-item {
      position: relative;
      list-style: none;
      cursor: pointer;

      .uname {
        font-size: 14px;
        color: #3a8ee6;
      }

      .action {
        margin: 0 4px;
        font-size: 14px;
        color: #999999;
      }

      .song-name {
        color: #ffffff;
      }

      .remove-btn {
        display: none;
        margin-left: 10px;
      }

      + .song-item {
        margin-top: 10px;
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
          opacity: 1;
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