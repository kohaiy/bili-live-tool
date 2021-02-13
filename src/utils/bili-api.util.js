import axios from 'axios';

// birthday: ""
// coins: 0
// face: "http://i0.hdslb.com/bfs/face/5cdf707a2b4d2b36cc399c832f9dcca663ee62af.jpg"
// fans_badge: false
// is_followed: false
// jointime: 0
// level: 5
// live_room: {roomStatus: 1, liveStatus: 0, url: "https://live.bilibili.com/519855", title: "写一会儿代码（可点歌）",…}
// mid: 24731556
// moral: 0
// name: "柯灰kohai"
// nameplate: {nid: 58, name: "收集达人",…}
// official: {role: 0, title: "", desc: "", type: -1}
// pendant: {pid: 994, name: "格兰芬多",…}
// rank: 10000
// sex: "保密"
// sign: "前端er 不定期分享前端小知识 ↵求点赞求关注ヾ(o◕∀◕)ﾉヾ"
// silence: 0
// sys_notice: {}
// theme: {}
// top_photo: "http://i0.hdslb.com/bfs/space/44873d3568bdcb3d850d234e02a19602972450f1.png"
// vip

class BiliApiUtil {
    /**
     * 获取用户信息
     * @param {string} mid
     * @returns {Promise<{
     * birthday: string;
     * coins: number;
     * face: string;
     * fans_badge: boolean;
     * is_followed: boolean;
     * jointime: number;
     * level: number;
     * live_room: any;
     * mid: number;
     * moral: number;
     * name: string;
     * nameplate: any;
     * official: any;
     * pendant: any;
     * rank: number;
     * sex: string;
     * sign: string;
     * silence: number;
     * sys_notice: any;
     * theme: any;
     * top_photo: string;
     * vip: any;
     * } | undefined>}
     */
    static async getUserInfo(mid) {
        const res = await axios.get('https://api.bilibili.com/x/space/acc/info', {
            params: {
                mid,
                jsonp: 'jsonp',
            }
        });
        if (res && res.data && res.data.code === 0) {
            return res.data.data;
        }
    }
}

export default BiliApiUtil;
