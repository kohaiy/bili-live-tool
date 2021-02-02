<template>
  <div class="interact-word">
    <span v-if="type === 1" class="enter">欢迎 {{ uname }} 进入直播间</span>
    <span v-else-if="type === 2" class="follow">感谢 {{ uname }} 的关注</span>
  </div>
</template>

<script>
export default {
  name: 'interact-word',
  props: {
    data: {
      type: Object,
      default: () => ({}),
    },
  },
  created() {
    console.log(this.data);
  },
  computed: {
    uname() {
      return this.data.uname;
    },
    type() {
      return this.data.msg_type;
    },
  },
};
</script>

<style lang="scss" scoped>
.interact-word {
  font-size: 12px;
  color: #999999;

  .follow {
    color: #f7b500;
  }
}
</style>