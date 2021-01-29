module.exports = {
    lintOnSave: false,
    pages: {
        index: 'src/main.js',
        setting: 'src/setting.js',
        music: 'src/music.js',
    },
    devServer: {
        historyApiFallback: {
            rewrites: [
                { from: /\/index/, to: '/index.html' },
                { from: /\/setting/, to: '/setting.html' },
                { from: /\/music/, to: '/music.html' },
            ],
        },
    },
    pluginOptions: {
        electronBuilder: {
            nodeIntegration: true,
            extraFiles: ['iconv-lite'],
            builderOptions: {
                appId: 'top.kohai.bili-live-tool',
                productName: '哔哩直播小助手',
                icon: './public/logo.png',
                copyright: 'Copyright © 2020 KOHAI',
            },
        },
    },
};
