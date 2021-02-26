// Depends on tencentcloud-sdk-nodejs version 4.0.3 or higher
const tencentcloud = require("tencentcloud-sdk-nodejs");

const TtsClient = tencentcloud.tts.v20190823.Client;

function getClient(secretId, secretKey) {
    const clientConfig = {
        credential: {
            secretId,
            secretKey,
        },
        region: "ap-guangzhou",
        profile: {
            httpProfile: {
                endpoint: "tts.tencentcloudapi.com",
            },
        },
    };
    return new TtsClient(clientConfig);
}

function textToVoice(params) {
    params.ModelType = params.ModelType || 1;
    params.SessionId = params.SessionId || 'SessionId';
    const { secretId, secretKey, ...others } = params;
    if (!secretId || !secretKey) return null;
    return new Promise(async resolve => {
        try {
            const t = setTimeout(() => resolve(null), 5000);
            const data = await getClient(secretId, secretKey).TextToVoice(others);
            clearTimeout(t);
            resolve(data && data.Audio);
        } catch (e) {
            console.log(e);
            resolve(null);
        }
    });
};

module.exports = textToVoice;
