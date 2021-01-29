import Vue from 'vue';
import ElementUI from 'element-ui';
import 'element-ui/lib/theme-chalk/index.css';
// import store from '@/store';
import IpcRendererUtil from '@/utils/ipc-renderer.util';
import Music from './pages/music/index.vue';

IpcRendererUtil.initial();
Vue.config.productionTip = false;
window.document.title = '点歌姬';

Vue.use(ElementUI);
new Vue({
    render: h => h(Music),
}).$mount('#app');