import axios from 'axios';
import querystring from 'querystring';
import encrypt from 'NeteaseCloudMusicApi/util/crypto';

class NeteaseCloudUtil {
    static async search(keywords) {
        let data = {
            s: keywords,
            type: 1, // 1: 单曲, 10: 专辑, 100: 歌手, 1000: 歌单, 1002: 用户, 1004: MV, 1006: 歌词, 1009: 电台, 1014: 视频
            limit: 30,
            offset: 0,
        };
        const formData = new FormData();
        Object.keys(data).forEach(key => {
            formData.append(key, data[key]);
        });
        data.csrf_token = '';
        data = encrypt.weapi(data);
        const res = await axios.post('https://music.163.com/weapi/search/get', querystring.stringify(data), {
            headers: {
                'Content-Type': 'application/x-www-form-urlencoded',
            },
        });
        if (res.status === 200) {
            const { code, result } = res.data;
            if (code === 200 && result.songs.length) {
                // const id = result.songs[0].id;
                // const res = await song_url({ id });
                // console.log(res.body.data);
                return result.songs[0];
            }
        }
        return null;
    }

    static async getHotList(id) {
        id = id || '3778678';
        let data = {
            id,
        };
        const formData = new FormData();
        Object.keys(data).forEach(key => {
            formData.append(key, data[key]);
        });
        data.csrf_token = '';
        data = encrypt.weapi(data);
        const res = await axios.post('https://music.163.com/api/v6/playlist/detail', querystring.stringify(data), {
            params: {
                id,
            },
            headers: {
                'Content-Type': 'application/x-www-form-urlencoded',
            },
        });
        if (res.status === 200) {
            const { code, playlist } = res.data;
            if (code === 200 && playlist) {
                return playlist.trackIds;
            }
        }
        return null;
    }

    static async getSongDetail(id) {
        let data = {
            c: `[{"id":${id}}]`,
            ids: `[${id}]`,
        };
        const formData = new FormData();
        Object.keys(data).forEach(key => {
            formData.append(key, data[key]);
        });
        data.csrf_token = '';
        data = encrypt.weapi(data);
        const res = await axios.post('https://music.163.com/weapi/v3/song/detail?id=' + id, querystring.stringify(data), {
            headers: {
                'Content-Type': 'application/x-www-form-urlencoded',
            },
        });
        if (res.status === 200) {
            const { code, songs } = res.data;
            if (code === 200 && songs && songs.length) {
                const [song] = songs;
                song.artists = song.ar;
                return song;
            }
        }
        return null;
    }
}

export default NeteaseCloudUtil;
