<template>
  <div class="interact-word">欢迎 {{ uname }} 进入直播间</div>
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
  computed: {
    uname() {
      return this.data.uname;
    },
  },
};
</script>

<style lang="scss" scoped>
.interact-word {
  font-size: 12px;
  color: #999999;
}
</style>