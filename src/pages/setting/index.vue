<template>
  <div class="setting">
    <el-form label-width="80px">
      <el-form-item label="UID:">
        <!--        <el-input size="mini" v-model="uid"/>-->
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
      <el-form-item label="">
        <el-checkbox size="mini" v-model="hideInteractWord"
          >隐藏入场语</el-checkbox
        >
        <el-checkbox size="mini" v-model="isPlayVoice">语音播报</el-checkbox>
      </el-form-item>
    </el-form>
    <div class="buttons">
      <el-button size="mini" @click="close">关闭</el-button>
      <el-button type="primary" @click="save" size="mini">保存</el-button>
    </div>
    <div>
      <el-button @click="handleOpenDrawGame" size="mini"
        >打开 DrawGame</el-button
      >
      <el-button @click="handleOpenSnakeGame" size="mini"
        >打开 Snake Game</el-button
      >
    </div>
  </div>
</template>

<script>
import { remote } from "electron";
import IpcRendererUtil from "@/utils/ipc-renderer.util";

export default {
  name: "Setting",
  data() {
    return {
      uid: "",
      maxSongTotal: +(localStorage.getItem("MAX_SONG_TOTAL") || "10"),
      hideInteractWord: !!+localStorage.getItem("HIDE_INTERACT_WORD"),
      isPlayVoice: !!+localStorage.getItem("IS_PLAY_VOICE"),
    };
  },
  watch: {
    hideInteractWord() {
      localStorage.setItem(
        "HIDE_INTERACT_WORD",
        this.hideInteractWord ? "1" : "0"
      );
    },
    isPlayVoice() {
      localStorage.setItem("IS_PLAY_VOICE", this.isPlayVoice ? "1" : "");
    },
  },
  created() {
    this.uid = localStorage.getItem("uid");
  },
  methods: {
    save() {
      if (this.uid) {
        localStorage.setItem("uid", this.uid);
        const uids = JSON.parse(localStorage.getItem("uids") || "[]");
        if (!uids.includes(this.uid)) {
          uids.push(this.uid);
        }
        localStorage.setItem("uids", JSON.stringify(uids));
        // this.close();
      }
      if (this.maxSongTotal) {
        localStorage.setItem("MAX_SONG_TOTAL", this.maxSongTotal);
      }
    },
    close() {
      remote.getCurrentWindow().close();
    },
    querySearch(queryString, cb) {
      const uids = JSON.parse(localStorage.getItem("uids") || "[]");
      const results = queryString
        ? uids.filter((uid) => String(uid).indexOf(queryString) === 0)
        : uids;
      console.log(results);
      cb(results.map((value) => ({ value })));
    },
    handleOpenDrawGame() {
      IpcRendererUtil.send("OPEN_DRAW_GAME");
    },
    handleOpenSnakeGame() {
      IpcRendererUtil.send("OPEN_SNAKE_GAME");
    },
  },
};
</script>

<style lang="scss" scoped>
.setting {
  padding: 30px;

  .buttons {
    text-align: right;
  }
}
</style>