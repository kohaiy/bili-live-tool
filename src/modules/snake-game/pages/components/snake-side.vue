<template>
  <div class="snake-side">
    <div class="header">排行榜</div>
    <div class="body">
      <div class="users">
        <div class="user" v-for="(user, i) in users" :key="user.uid">
          <div class="user-rank">{{ i + 1 }}</div>
          <div class="user-face">
            <snake-head :pic="user.face" :name="user.name"/>
          </div>
          <div class="user-right">
            <div class="user-name">{{ user.name }}</div>
            <div class="user-score">{{ user.score }}</div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import SnakeHead from './snake-head';

export default {
  components: { SnakeHead },
  name: 'SnakeSide',
  data() {
    return {
      snake: undefined,
    };
  },
  computed: {
    users() {
      return this.snake ? this.snake.users : [];
    },
  },
  created() {
    this.$bus.$on('setSnake', (snake) => {
      this.snake = snake;
    });
  },
};
</script>

<style lang="scss" scoped>
.snake-side {
  display: flex;
  flex-direction: column;
  width: 200px;

  .header {
    display: flex;
    align-items: center;
    height: 28px;
    padding: 0 12px;
    font-size: 12px;
    color: #eee;
    background-color: rgba(0, 0, 0, 0.8);
    -webkit-app-region: drag;
  }

  .body {
    flex: 1;
    color: #eee;
    //background-color: rgba(0, 0, 0, 0.6);
    overflow: auto;

    .users {
      .user {
        display: flex;
        align-items: center;
        padding: 4px;
        background-color: rgba(0, 0, 0, 0.2);

        .user-rank {
          font-size: 14px;
          font-weight: bold;
          color: #f45a8d;
        }

        .user-face {
          margin: 0 4px;
          font-size: 28px;
        }

        .user-right {
          flex: 1;
          display: flex;
          flex-direction: column;
          overflow: hidden;
        }

        .user-name {
          width: 100%;
          font-size: 12px;
          word-wrap: none;
          word-break: keep-all;
          overflow: hidden;
          text-overflow: ellipsis;
        }

        .user-score {
          font-size: 12px;
          color: #ffff00;
        }
      }
    }
  }
}
</style>