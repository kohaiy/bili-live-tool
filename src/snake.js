import Vue from 'vue';
import ElementUI from 'element-ui';
import 'element-ui/lib/theme-chalk/index.css';
import store from '@/store';
import IpcRendererUtil from '@/utils/ipc-renderer.util';
import Snake from './modules/snake-game/pages';
console.log(store);
IpcRendererUtil.initial();
Vue.config.productionTip = false;

Vue.prototype.$bus = new Vue();

Vue.use(ElementUI);
new Vue({
    store,
    render: h => h(Snake),
}).$mount('#app');
