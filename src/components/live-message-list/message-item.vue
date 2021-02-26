<template>
  <div class="message-item">
    <component :is="msgType(cmd)" :data="msgData" :ignoreVoice="data.ignore"/>
  </div>
</template>

<script>
import DanmuMsg from './components/danmu-msg';
import InteractWord from './components/interact-word';
import SendGift from './components/send-gift';

export default {
  name: 'message-item',
  props: {
    data: {
      type: Object,
      default: () => ({}),
    },
  },
  computed: {
    cmd() {
      return this.data.cmd;
    },
    msgData() {
      return this.data.info || this.data.data;
    },
    showInteractWord() {
      return !+localStorage.getItem('HIDE_INTERACT_WORD') || this.msgData.msg_type !== 1;
    },
  },
  methods: {
    msgType(cmd) {
      return ({
        DANMU_MSG: DanmuMsg,
        INTERACT_WORD: this.showInteractWord ? InteractWord : undefined,
        SEND_GIFT: SendGift,
        COMBO_SEND: SendGift,
      })[cmd];
    },
  },
};

</script>

<style lang="scss" scoped>
.message-item {
  + .message-item {
    margin-top: 8px;
  }

  &:empty {
    margin-top: 0;
  }
}
</style>