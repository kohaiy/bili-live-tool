import Vue from 'vue';
import ElementUI from 'element-ui';
import 'element-ui/lib/theme-chalk/index.css';
import IpcRendererUtil from '@/utils/ipc-renderer.util';
import DrawGame from './pages/draw-game/index.vue';

IpcRendererUtil.initial();
Vue.config.productionTip = false;

Vue.use(ElementUI);
new Vue({
    render: h => h(DrawGame),
}).$mount('#app');
