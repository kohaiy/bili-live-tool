<template>
  <div class="live-message-list" ref="list">
    <div class="live-message-list__inner">
      <message-item v-for="msg in messages" :key="msg.id" :data="msg" />
    </div>
    <div
      class="to-bottom"
      :class="{ 'is-hidden': isToBottom }"
      title="到底部"
      @click="handleToBottom"
    >
      <span v-if="unreadTotal" class="unread">{{
        unreadTotal > 99 ? '∞' : unreadTotal
      }}</span>
      <i v-else class="el-icon-message-solid"></i>
    </div>
  </div>
</template>

<script>
import { mapState, mapMutations, mapActions } from 'vuex';
import { encode, decode } from '@/utils/bili-data.util';
import MessageItem from '@/components/live-message-list/message-item';
import NeteaseCloudUtil from '@/utils/netease-cloud.util';
import IpcRendererUtil from '@/utils/ipc-renderer.util';

let ws, timer, audio;
export default {
  name: 'live-message-list',
  components: { MessageItem },
  data() {
    return {
      isToBottom: true,
      unreadTotal: 0,
    };
  },
  computed: {
    ...mapState(['messages', 'roomId', 'currentVoice']),
  },
  watch: {
    roomId: {
      handler() {
        this.startWs(true);
      },
      immediate: true,
    },
    currentVoice() {
      this.handlePlayVoice();
    },
  },
  mounted() {
    // this.startWs();
    this.$refs.list.addEventListener('scroll', this.handleScroll);
    // if (localStorage.getItem('IS_PLAY_VOICE')) {}
  },
  beforeDestroy() {
    this.$refs.list.removeEventListener('scroll', this.handleScroll);
  },
  methods: {
    ...mapMutations([
      'setOnline',
      'appendMessage',
      'nextVoice',
      'appendVoice',
      'resetVoiceType',
    ]),
    ...mapActions(['getVoiceType']),
    startWs() {
      if (ws) {
        ws.close();
      }
      if (timer) {
        clearInterval(timer);
      }
      if (!this.roomId) return;
      ws = new WebSocket('ws://broadcastlv.chat.bilibili.com:2244/sub');
      ws.onopen = () => {
        ws.send(
          encode(
            JSON.stringify({
              protover: 1,
              clientver: '1.4.0',
              roomid: this.roomId,
            }),
            7
          )
        );
        ws.send(encode('', 2));
        ws.onmessage = async (msgEvent) => {
          // console.log(msgEvent);
          const packet = await decode(msgEvent.data);
          // console.warn(packet);
          switch (packet.op) {
            case 8:
              console.log('加入房间');
              break;
            case 3:
              this.setOnline(packet.body.count);
              break;
            case 5:
              packet.body.forEach((body, i) => {
                body.id =
                  Date.now().toString() +
                  `_${i}_` +
                  Math.round(Math.random() * 8000 + 1000);
                body.time = Date.now();
                body.isEnter =
                  body.cmd === 'INTERACT_WORD' && body.data.msg_type === 1;
                // console.log(body);
                switch (body.cmd) {
                  case 'DANMU_MSG':
                    this.handleDanmuMsg(body);
                    // console.log(`%c[!] [${body.info[3][1]}|${body.info[3][0]}]${body.info[2][1]}: ${body.info[1]}`, 'background-color:yellow;');
                    break;
                  case 'SEND_GIFT':
                    // console.log(body);
                    // console.log(`%c[*] ${body.data.uname} ${body.data.action} ${body.data.num} 个 ${body.data.giftName}`, 'color:green;');
                    break;
                  case 'COMBO_SEND':
                    // console.log('COMBO_SEND', body);
                    this.appendVoice({
                      uid: +localStorage.getItem('uid'),
                      message: `谢谢${body.data.uname}${body.data.action}${
                        body.data.num || body.data.combo_num
                      }个${body.data.giftName || body.data.gift_name}`,
                    });
                    break;
                  case 'INTERACT_WORD':
                    if (body.data.msg_type === 2) {
                      this.appendVoice({
                        uid: +localStorage.getItem('uid'),
                        message: `感谢${body.data.uname}的关注`,
                      });
                    }
                    if (body.data.msg_type > 2) {
                      console.error('body.data.msg_type > 2', body.data);
                    }
                    break;
                  //   case 'WELCOME':
                  //     console.log(`欢迎 ${body.data.uname}`);
                  //     break;
                  //     // 此处省略很多其他通知类型
                  //   case "INTERACT_WORD":
                  //     console.log(`%c[+] 欢迎 [${body.data.fans_medal.medal_name} ${body.data.fans_medal.medal_level}]${body.data.uname}`, 'color:#ccc;');
                  //     break;
                  default:
                    console.log('body ->', body);
                }
                this.appendMessage(body);
              });
              break;
            default:
              console.log(packet);
          }
          if (this.isToBottom) {
            this.$nextTick(() => {
              this.scrollToBottom();
            });
          }
        };
      };
      timer = setInterval(function () {
        ws.send(encode('', 2));
      }, 30000);
    },
    async handleDanmuMsg(body) {
      if (!this.isToBottom) {
        this.unreadTotal++;
      }
      const [message, uname, uid] = [
        body.info[1],
        body.info[2][1],
        body.info[2][0],
      ];
      if (/^点歌/.test(message)) {
        const keywords = message.replace('点歌', '').trim();
        // 通过关键词搜索网易歌曲
        const song = await NeteaseCloudUtil.search(keywords);
        console.log(song);
        if (song) {
          // const songs = JSON.parse(localStorage.getItem('songs') || '[]');
          // if (songs.length < 100) {
          //   const { id, name } = song;
          // songs.push({
          //   uname, id, name,
          // });
          // localStorage.setItem('songs', JSON.stringify(songs));
          song.uname = uname;
          // 把歌曲信息存储到localStorage里面，供另一个窗口读取
          localStorage.setItem('NEW_SONG', JSON.stringify(song));
          // }
        }
      } else if (message === '切歌') {
        IpcRendererUtil.send('NEXT_SONG', uid);
      } else if (/^s/i.test(message)) {
        body.ignore = true;
        IpcRendererUtil.send('SNAKE_ACTION', {
          uid,
          message,
        });
      } else if (
        /^\s*\d+[,，\s]\d+[,，\s][#＃][0-9a-fA-F]{3,6}\s*$/.test(message)
      ) {
        body.ignore = true;
        IpcRendererUtil.send('DRAW_POINT', message);
      } else {
        if (message === '变声') {
          this.resetVoiceType(uid);
        }
        if (localStorage.getItem('IS_PLAY_VOICE')) {
          this.appendVoice({ uid, message });
        }
      }
    },
    scrollToBottom() {
      if (this.$refs.list) {
        this.$nextTick(() => {
          this.$refs.list.scrollTo({
            top: this.$refs.list.scrollHeight - this.$refs.list.offsetHeight,
            behavior: 'smooth',
          });
        });
      }
    },
    handleToBottom() {
      this.isToBottom = true;
      this.unreadTotal = 0;
      this.scrollToBottom();
    },
    handleScroll() {
      const { scrollHeight, scrollTop, clientHeight } = this.$refs.list;
      this.isToBottom = scrollHeight - scrollTop - clientHeight <= 10;
      if (this.isToBottom) {
        this.unreadTotal = 0;
      }
    },
    async handlePlayVoice() {
      if (this.currentVoice) {
        try {
          let url;
          if (+localStorage.getItem('TTS_SOURCE') === 1) {
            const data = await IpcRendererUtil.send('TTS', {
              Text: this.currentVoice.message,
              VoiceType: await this.getVoiceType(this.currentVoice.uid),
              secretId: localStorage.getItem('tts_secretId'),
              secretKey: localStorage.getItem('tts_secretKey'),
            });
            if (!data) {
              return this.nextVoice();
            }
            url = `data:audio/x-wav;base64,${data}`;
            if (!audio) {
              audio = new Audio();
              audio.addEventListener('ended', () => {
                this.nextVoice();
              });
            }
            audio.src = url;

            await audio.play();
          } else {
            // url =
            //   'http://tts.baidu.com/text2audio?lan=zh&ie=UTF-8&text=' +
            //   encodeURI(this.currentVoice.message);
            const u = new SpeechSynthesisUtterance();
            u.text = this.currentVoice.message;
            u.lang = 'zh-CN';
            u.rate = 1;
            speechSynthesis.speak(u);
            this.nextVoice();
          }
        } catch (e) {
          console.error(e);
          this.nextVoice();
        }
      }
    },
  },
};
</script>

<style lang="scss" scoped>
.live-message-list {
  position: relative;
  width: 100%;
  height: 100%;
  overflow: auto;

  .live-message-list__inner {
    padding: 10px 20px 40px;
  }

  .msg {
    display: flex;
    flex-wrap: wrap;
    align-items: center;
    list-style: none;

    + .msg {
      margin-top: 10px;
    }
  }

  .to-bottom {
    position: fixed;
    right: 20px;
    bottom: 10px;
    width: 24px;
    height: 24px;
    line-height: 24px;
    text-align: center;
    font-size: 16px;
    border-radius: 8px 8px 0 8px;
    background-color: #3a8ee6;
    cursor: pointer;
    opacity: 1;
    transform-origin: bottom right;
    transform: scale(1);
    transition: all 0.3s;

    &.is-hidden {
      transform: scale(0);
      opacity: 0;
    }

    .unread {
      font-size: 14px;
    }
  }
}
</style>
