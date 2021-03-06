import Vue from 'vue';
import ElementUI from 'element-ui';
import 'element-ui/lib/theme-chalk/index.css';
import App from './App.vue';
import store from './store';
import IpcRendererUtil from '@/utils/ipc-renderer.util';

Vue.config.productionTip = false;
IpcRendererUtil.initial();
Vue.use(ElementUI);

new Vue({
    store,
    render: h => h(App),
}).$mount('#app');
