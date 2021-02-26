<template>
  <div class="setting">
    <el-form>
      <el-form-item label="UID:">
        <el-autocomplete
          size="mini"
          v-model="uid"
          :fetch-suggestions="querySearch"
          placeholder="请输入内容"
        ></el-autocomplete>
      </el-form-item>
      <el-form-item label="歌单上限:">
        <el-input-number size="mini" v-model="maxSongTotal" />
      </el-form-item>
      <div class="buttons">
        <el-button type="primary" @click="save" size="mini">保存</el-button>
      </div>
    </el-form>
    <hr />
    <p>
      <el-checkbox size="mini" v-model="hideInteractWord">
        隐藏入场语
      </el-checkbox>
      <el-checkbox size="mini" v-model="isPlayVoice">语音播报</el-checkbox>
    </p>
    <p v-show="isPlayVoice">
      <el-radio-group
        v-model="ttsSource"
        @change="handleTtsSourceChange"
        size="mini"
      >
        <el-radio-button :label="0">系统语音</el-radio-button>
        <el-radio-button :label="1">腾讯云语音</el-radio-button>
      </el-radio-group>
      <span v-show="ttsSource === 1" style="display: block; margin-top: 10px">
        <el-input
          v-model="secretId"
          @change="handleTtsSecretChange"
          type="password"
          size="mini"
          placeholder="腾讯云语音 secretId"
        ></el-input>
        <el-input
          v-model="secretKey"
          @change="handleTtsSecretChange"
          type="password"
          size="mini"
          placeholder="腾讯云语音 secretKey"
          style="margin-top: 4px"
        ></el-input>
      </span>
    </p>
    <p>
      <el-button @click="handleOpenDrawGame" size="mini">
        像素画游戏
      </el-button>
      <el-button @click="handleOpenSnakeGame" size="mini">
        贪吃蛇游戏
      </el-button>
    </p>
  </div>
</template>

<script>
import { remote } from 'electron';
import IpcRendererUtil from '@/utils/ipc-renderer.util';

export default {
  name: 'Setting',
  data() {
    return {
      uid: '',
      maxSongTotal: +(localStorage.getItem('MAX_SONG_TOTAL') || '10'),
      hideInteractWord: !!+localStorage.getItem('HIDE_INTERACT_WORD'),
      isPlayVoice: !!+localStorage.getItem('IS_PLAY_VOICE'),
      ttsSource: +(localStorage.getItem('TTS_SOURCE') || '0'),
      secretId: localStorage.getItem('tts_secretId') || '',
      secretKey: localStorage.getItem('tts_secretKey') || '',
    };
  },
  watch: {
    hideInteractWord() {
      localStorage.setItem(
        'HIDE_INTERACT_WORD',
        this.hideInteractWord ? '1' : '0'
      );
    },
    isPlayVoice() {
      localStorage.setItem('IS_PLAY_VOICE', this.isPlayVoice ? '1' : '');
    },
  },
  created() {
    this.uid = localStorage.getItem('uid');
  },
  methods: {
    handleTtsSourceChange() {
      localStorage.setItem('TTS_SOURCE', this.ttsSource);
    },
    handleTtsSecretChange() {
      localStorage.setItem('tts_secretId', this.secretId);
      localStorage.setItem('tts_secretKey', this.secretKey);
    },
    save() {
      if (this.uid) {
        localStorage.setItem('uid', this.uid);
        const uids = JSON.parse(localStorage.getItem('uids') || '[]');
        if (!uids.includes(this.uid)) {
          uids.push(this.uid);
        }
        localStorage.setItem('uids', JSON.stringify(uids));
        // this.close();
      }
      if (this.maxSongTotal) {
        localStorage.setItem('MAX_SONG_TOTAL', this.maxSongTotal);
      }
    },
    close() {
      remote.getCurrentWindow().close();
    },
    querySearch(queryString, cb) {
      const uids = JSON.parse(localStorage.getItem('uids') || '[]');
      const results = queryString
        ? uids.filter((uid) => String(uid).indexOf(queryString) === 0)
        : uids;
      console.log(results);
      cb(results.map((value) => ({ value })));
    },
    handleOpenDrawGame() {
      IpcRendererUtil.send('OPEN_DRAW_GAME');
    },
    handleOpenSnakeGame() {
      IpcRendererUtil.send('OPEN_SNAKE_GAME');
    },
  },
};
</script>

<style lang="scss" scoped>
.setting {
  padding: 20px 30px;

  .buttons {
    text-align: right;
  }
}
</style>