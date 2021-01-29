<template>
  <div class="send-gift">
    <span>感谢</span>
    <span class="uname">{{ uname }}</span>
    <span class="action">{{ action }}</span>
    <span class="gift-name">{{ giftName }}</span>
    <span class="gift-img gift-frame" :class="`gift-${giftId}-20`"></span>
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
};
</script>
<style src="./gift.css"/>
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
    width: 20px;
    height: 20px;
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
