<template>
  <div class="up-stat-info">
    <span class="stat-item">
      <span class="label">在线人数：</span>
      <span class="value">{{ online }}</span>
    </span>
    <span class="stat-item">
      <span class="label">粉丝数：</span>
      <span class="value">{{ upInfo.follower }}</span>
    </span>
  </div>
</template>

<script>
import { mapMutations, mapState } from 'vuex';
import axios from 'axios';

export default {
  name: 'up-stat-info',
  data() {
    return {
      upInfo: {
        black: 0,
        follower: 0,
        following: 0,
        mid: 0,
        whisper: 0,
      },
    };
  },
  computed: {
    ...mapState(['uid', 'online']),
  },
  watch: {
    uid: {
      handler(val) {
        if (val)
          this.getInfo(true);
      },
      immediate: true,
    },
  },
  mounted() {
    if (localStorage.getItem('uid')) {
      this.setUid(localStorage.getItem('uid'));
    }
    setInterval(() => {
      if (localStorage.getItem('uid')) {
        this.setUid(localStorage.getItem('uid'));
      }
    }, 1000);
    // this.getInfo();
  },
  methods: {
    ...mapMutations(['setUid', 'setRoomId']),
    async getInfo(isFirst = false) {
      await this.getUpInfo();
      await this.getRoomInfo(isFirst);
      setTimeout(() => this.getInfo(), 60 * 1000);
    },
    async getRoomInfo(isFirst = false) {
      const res = await axios.get('https://api.bilibili.com/x/space/acc/info', {
        params: {
          mid: this.uid,
        },
      });
      const data = res.data;
      if (data && data.code === 0) {
        this.setRoomId(data.data.live_room.roomid);
        if (isFirst) {
          if (data.data.live_room.roomStatus) {
            this.$message.success(`欢迎来到【${data.data.name}】的直播间`);
          } else {
            this.$message.warning('该UP主未开通直播间');
          }
        }
      }
      // console.log(data);
    },
    async getUpInfo() {
      const res = await axios.get('https://api.bilibili.com/x/relation/stat?vmid=' + this.uid);
      const data = res.data;
      // console.log('getUpInfo', res);
      if (data && data.code === 0) {
        this.upInfo = data.data;
      }
    },
  },
};
</script>

<style lang="scss" scoped>
.up-stat-info {
  padding: 10px 20px;
  border-bottom: 1px solid #333333;
  user-select: none;

  .stat-item {

    + .stat-item {
      margin-left: 20px;
    }

    .label {
      font-size: 12px;
      color: #999999;
    }

    .value {
      font-size: 16px;
      color: #ffffff;
    }
  }

}
</style>
