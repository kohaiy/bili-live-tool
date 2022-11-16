import Vue from "vue";
import ElementUI from "element-ui";
import "element-ui/lib/theme-chalk/index.css";
import App from "./App.vue";
import store from "./store";
import IpcRendererUtil from "@/utils/ipc-renderer.util";

Vue.config.productionTip = false;
IpcRendererUtil.initial();
Vue.use(ElementUI);

const loadGiftStyle = async () => {
  const res = await fetch(
    "https://api.live.bilibili.com/xlive/web-room/v1/giftPanel/giftConfig?platform=pc&room_id=55&area_parent_id=11&area_id=377"
  );
  const {
    data: { list },
  } = await res.json();
  const styleTxt = list
    .map(({ id, gif }) => {
      return `.gift-${id} { background-image: url(${gif}) } `;
    })
    .join("\n");
  const style$ = document.createElement("style");
  style$.innerHTML = styleTxt;
  document.head.append(style$);
};
loadGiftStyle();
new Vue({
  store,
  render: (h) => h(App),
}).$mount("#app");
