import Vue from "vue";
import VueRouter from "vue-router";

Vue.use(VueRouter);

const routes = [
  {
    path: "/",
    name: "Home",
    component: () => import("../views/home"),
  },
  {
    path: "/notFound",
    name: "notFound",
    meta: {
      title: "404",
      keepAlive: true,
    },
    component: () => import(`../views/notFound`),
  },
  {
    path: "*",
    redirect: "/notFound",
  },
];

const router = new VueRouter({
  routes,
});

export default router;
