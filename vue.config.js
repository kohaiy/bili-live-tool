module.exports = {
    lintOnSave: false,
    pages: {
        index: 'src/main.js',
        setting: 'src/setting.js',
        music: 'src/music.js',
        snake: 'src/snake.js',
        'draw-game': 'src/draw-game.js'
    },
    devServer: {
        historyApiFallback: {
            rewrites: [
                { from: /\/index/, to: '/index.html' },
                { from: /\/setting/, to: '/setting.html' },
                { from: /\/music/, to: '/music.html' },
                { from: /\/snake/, to: '/snake.html' },
                { from: /\/draw-game/, to: '/draw-game.html' },
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
