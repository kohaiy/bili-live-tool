import pako from 'pako';

const textEncoder = new TextEncoder('utf-8');
const textDecoder = new TextDecoder('utf-8');

const readInt = function (buffer, start, len) {
    let result = 0;
    for (let i = len - 1; i >= 0; i--) {
        result += Math.pow(256, len - i - 1) * buffer[start + i];
    }
    return result;
};

const writeInt = function (buffer, start, len, value) {
    let i = 0;
    while (i < len) {
        buffer[start + i] = value / Math.pow(256, len - i - 1);
        i++;
    }
};

export const encode = function (str, op) {
    let data = textEncoder.encode(str);
    let packetLen = 16 + data.byteLength;
    let header = [0, 0, 0, 0, 0, 16, 0, 1, 0, 0, 0, op, 0, 0, 0, 1];
    writeInt(header, 0, 4, packetLen);
    return (new Uint8Array(header.concat(...data))).buffer;
};

export const decode = function (blob) {
    return new Promise(function (resolve) {
        let reader = new FileReader();
        reader.onload = function (e) {
            let buffer = new Uint8Array(e.target.result);
            let result = {};
            result.packetLen = readInt(buffer, 0, 4);
            result.headerLen = readInt(buffer, 4, 2);
            result.ver = readInt(buffer, 6, 2);
            result.op = readInt(buffer, 8, 4);
            result.seq = readInt(buffer, 12, 4);
            if (result.op === 5) {
                result.body = [];
                let offset = 0;
                while (offset < buffer.length) {
                    let packetLen = readInt(buffer, offset, 4);
                    let headerLen = 16; //readInt(buffer,offset + 4,4)
                    let data = buffer.slice(offset + headerLen, offset + packetLen);
                    // console.log(data);

                    /**
                     * 仅有两处更改
                     * 1. 引入pako做message解压处理，具体代码链接如下
                     *    https://github.com/nodeca/pako/blob/master/dist/pako.js
                     * 2. message文本中截断掉不需要的部分，避免JSON.parse时出现问题
                     */
                    let body;
                    try {
                        body = textDecoder.decode(pako.inflate(data));
                    } catch (e) {
                        // console.log(e);
                    }
                    if (body) {
                        // console.log('--------------');
                        // console.log(body);
                        // console.log('--------------');
                        // 同一条 message 中可能存在多条信息，用正则筛出来
                        // eslint-disable-next-line no-control-regex
                        const group = body.split(/[\x00-\x1f]+/);
                        // console.log('--------------');
                        // console.log(group);
                        // console.log('--------------');
                        // console.log(group);
                        group.forEach(item => {
                            try {
                                if (item && item.includes('{'))
                                    result.body.push(JSON.parse(item));
                            } catch (e) {
                                // 忽略非 JSON 字符串，通常情况下为分隔符
                            }
                        });
                    }

                    offset += packetLen;
                }
            } else if (result.op === 3) {
                result.body = {
                    count: readInt(buffer, 16, 4)
                };
            }
            resolve(result);
        };
        reader.readAsArrayBuffer(blob);
    });
};

export default {
    readInt,
    writeInt,
    encode,
    decode,
};
