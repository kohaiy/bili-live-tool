<template>
  <div class="danmu-msg">
    <div class="msg-medal" :class="`level-${medal[0]}`" v-if="medal">
      <div class="fans-medal-label"> {{ medal[1] }}</div>
      <div class="fans-medal-level">{{ medal[0] }}</div>
    </div>
    <div class="msg-nickname">{{ uname }}:</div>
    <div class="msg-text">{{ msg }}</div>
  </div>
</template>

<script>
export default {
  name: 'danmu-msg',
  props: {
    data: {
      type: Array,
      default: () => [],
    },
    ignoreVoice: {
      type: Boolean,
      default: false,
    },
  },
  created() {
    if (localStorage.getItem('IS_PLAY_VOICE') && !this.ignoreVoice) {
      const url = 'http://tts.baidu.com/text2audio?lan=zh&ie=UTF-8&text=' + encodeURI(this.msg);
      const audio = new Audio(url);
      audio.play();
    }
  },
  computed: {
    medal() {
      // [0] 等级，[11] 是否激活
      if (this.data[3] && this.data[3][0] > 0 && this.data[3][11]) {
        return this.data[3];
      }
      return false;
    },
    uname() {
      return this.data[2] && this.data[2][1];
    },
    msg() {
      return this.data[1];
    },
  },
};
</script>

<style lang="scss" scoped>
$colors: [
    #2c0, // 1
    #4a0, // 2
    #680, // 3
    #860, // 4
    #5d7b9e, // 5
    #5d7b9e, // 6
    #f00, // 7
    #5d7b9e, // 8
    #a40, // 9
    #860, // 10
    #8d7ca6, // 11
    #be6686, // 12
    #be6686, // 13
    #be6686, // 14
    #be6686, // 15
    #000000, // 16
    #c79d24, // 17
    #000000, // 18
    #000000, // 19
    #000000, // 20
    #000000, // 21
    #000000, // 22
    #000000, // 23
];

.danmu-msg {
  display: flex;
  align-items: center;
  flex-wrap: wrap;

  .msg-medal {
    display: inline-block;
    margin-right: 10px;
    background-color: #ffffff;
    overflow: hidden;
    box-sizing: content-box;
    height: 14px;
    line-height: 14px;
    color: #fff;
    border: 1px solid #000000;
    white-space: nowrap;
    border-radius: 2px;
    font-size: 12px;
    position: relative;
    cursor: default;

    .fans-medal-label {
      display: flex;
      justify-content: center;
      align-items: center;
      min-width: 12px;
      padding: 0 4px;
      color: #fff;
      border-top-left-radius: 1px;
      border-bottom-left-radius: 1px;
      box-sizing: content-box;
      height: 100%;
      text-align: center;
      float: left;
      background-image: linear-gradient(45deg, #000000, #000000);
    }

    .fans-medal-level {
      width: 16px;
      background-color: #fff;
      text-align: center;
      border-top-left-radius: 1px;
      border-bottom-right-radius: 1px;
      display: block;
      box-sizing: content-box;
      height: 100%;
      float: left;
      color: #000000;
    }
  }

  @for $i from 1 to length($colors) {
    $c: nth($colors, $i);
    .msg-medal.level-#{$i} {
      border-color: $c;

      .fans-medal-label {
        background-image: linear-gradient(45deg, $c, $c);
      }

      .fans-medal-level {
        color: $c;
      }
    }
  }

  .msg-nickname {
    display: inline-block;
    margin-right: 10px;
    font-size: 12px;
    color: #39b0f1;
  }

  .msg-text {
    font-size: 12px;
    color: #cccccc;
  }
}
</style>
