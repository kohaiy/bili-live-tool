import Vue from 'vue';
import ElementUI from 'element-ui';
import 'element-ui/lib/theme-chalk/index.css';
// import store from '@/store';
import IpcRendererUtil from '@/utils/ipc-renderer.util';
import Setting from './pages/setting/index.vue';

IpcRendererUtil.initial();
Vue.config.productionTip = false;

Vue.use(ElementUI);
new Vue({
    render: h => h(Setting),
}).$mount('#app');