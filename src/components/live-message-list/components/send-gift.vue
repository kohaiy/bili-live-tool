<template>
  <div class="send-gift">
    <span>感谢</span>
    <span class="uname">{{ uname }}</span>
    <span class="action">{{ action }}</span>
    <span class="gift-name">{{ giftName }}</span>
    <span class="gift-img gift-frame" :class="`gift-${giftId}`"></span>
    <span class="num">x{{ num }}</span>
  </div>
</template>

<script>
export default {
  name: 'send-gift',
  props: {
    data: {
      type: Object,
      default: () => ({}),
    },
  },
  computed: {
    uname() {
      return this.data.uname;
    },
    action() {
      return this.data.action;
    },
    giftName() {
      return this.data.giftName || this.data.gift_name;
    },
    giftId() {
      return this.data.giftId || this.data.gift_id;
    },
    num() {
      return this.data.num || this.data.combo_num;
    },
  },
  mounted() {
    // if (localStorage.getItem('IS_PLAY_VOICE')) {
    //   const url = 'http://tts.baidu.com/text2audio?lan=zh&ie=UTF-8&text='
    //       + encodeURI(`谢谢${this.uname}${this.action}${this.num}个${this.giftName}`);
    //   const audio = new Audio(url);
    //   audio.play();
    // }
  },
};
</script>

<style lang="scss" scoped>
.send-gift {
  font-size: 12px;
  color: #999999;

  .uname {
    margin-left: 2px;
    color: #cccccc;
  }

  .action {
    margin: 0 2px;
  }

  .gift-name {
    font-size: 14px;
    font-weight: bold;
    color: #f7b500;
  }

  .gift-img {
    display: inline-block;
    width: 24px;
    height: 24px;
  }

  .num {
    margin-left: 2px;
    color: #f7b500;
  }
}

.gift-frame {
  background-size: cover;
  background-repeat: no-repeat;
  image-rendering: crisp-edges;
}
</style>
