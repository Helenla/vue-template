import Vue from "vue";
import App from "./App.vue";
import router from "./router";
import "./router/router.interceptor";
import store from "./store";
import "./assets/scss/reset.scss";
import "./assets/scss/app.scss";
import "./common/fastclick";
import "./plugins/vant";
import vconsole from "vconsole";

false && new vconsole();

new Vue({
  router,
  store,
  render: (h) => h(App),
}).$mount("#app");
