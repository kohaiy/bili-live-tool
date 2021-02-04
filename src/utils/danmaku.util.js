import { decode, encode } from '@/utils/bili-data.util';

/**
 * 处理事件提交
 * @param eventMap{Map<string, Function[]>}
 * @param type{string}
 * @param payload{any}
 */
function handleEmit(eventMap, type, payload) {
    const events = eventMap.get(type);
    if (events) {
        events.forEach(ev => ev(payload));
    }
}

/**
 * 消息类型
 * @type {Readonly<{
 *  INTERACT_WORD: string,
 *  DANMU_MSG: string,
 *  COMBO_SEND: string,
 *  SEND_GIFT: string,
 *  ONLINE_COUNT: string,
 *  OTHER: string
 *  }>}
 */
const MSG_TYPE = Object.freeze({
    ONLINE_COUNT: 'ONLINE_COUNT', // 人气
    INTERACT_WORD: 'INTERACT_WORD', // 互动词
    ENTER_ROOM: 'ENTER_ROOM', // 进入直播间
    FOLLOW_ROOM: 'FOLLOW_ROOM', // 关注直播间
    SHARE_ROOM: 'SHARE_ROOM', // 分享直播姬
    DANMU_MSG: 'DANMU_MSG', // 弹幕消息
    SEND_GIFT: 'SEND_GIFT', // 发送礼物（散装）
    COMBO_SEND: 'COMBO_SEND', // 发送礼物（打包）
    OTHER: 'OTHER', // 其他类型
});

class DanmakuUtil {
    static MSG_TYPE = MSG_TYPE;

    constructor() {
        this.ws = null;
        this.timer = null;
        this.eventMap = new Map();
    }

    /**
     * 连接 WebSocket
     * @param roomId{string} 房间 id
     * @return {DanmakuUtil}
     */
    connect(roomId) {
        this.ws = new WebSocket('ws://broadcastlv.chat.bilibili.com:2244/sub');
        this.ws.onopen = () => {
            this.ws.send(encode(JSON.stringify({
                protover: 1,
                clientver: '1.4.0',
                roomid: roomId,
            }), 7));
            this.ws.send(encode('', 2));
            this.ws.onmessage = async (msgEvent) => {
                const packet = await decode(msgEvent.data);
                switch (packet.op) {
                    case 8:
                        console.log('加入房间');
                        break;
                    case 3:
                        handleEmit(this.eventMap, MSG_TYPE.ONLINE_COUNT, packet.body.count);
                        break;
                    case 5:
                        packet.body.forEach((body, i) => {
                            // 生成唯一 id
                            body.id = Date.now().toString() + `_${i}_` + Math.round(Math.random() * 8000 + 1000);
                            body.time = Date.now();
                            body.isEnter = body.cmd === 'INTERACT_WORD' && body.data.msg_type === 1;
                            // console.log(body);
                            switch (body.cmd) {
                                case MSG_TYPE.DANMU_MSG:
                                case MSG_TYPE.SEND_GIFT:
                                case MSG_TYPE.COMBO_SEND:
                                    handleEmit(this.eventMap, body.cmd, body);
                                    break;
                                case MSG_TYPE.INTERACT_WORD:
                                    handleEmit(this.eventMap, MSG_TYPE.INTERACT_WORD, body);
                                    handleEmit(this.eventMap, [undefined,
                                        MSG_TYPE.ENTER_ROOM,
                                        MSG_TYPE.FOLLOW_ROOM,
                                        MSG_TYPE.SHARE_ROOM,
                                    ][body.data.msg_type], body);
                                    break;
                                default:
                                    console.log('body ->', body);
                            }
                        });
                        break;
                    default:
                        handleEmit(this.eventMap, MSG_TYPE.OTHER, packet);
                }
            };
            this.timer = setInterval(() => {
                this.ws.send(encode('', 2));
            }, 30000);
        };
        return this;
    }

    /**
     * 挂载事件监听
     * @param type{string} 事件类型
     * @param callback{Function} 回调方法
     */
    on(type, callback) {
        if (!this.eventMap.has(type)) {
            this.eventMap.set(type, []);
        }
        this.eventMap.get(type).push(callback);
    }

    /**
     * 卸载事件监听
     * @param type{string} 事件类型
     * @param callback{Function} 回调方法
     */
    off(type, callback) {
        const events = this.eventMap.get(type);
        if (events) {
            events.splice(events.indexOf(callback), 1);
        }
    }
}

export default DanmakuUtil;
