import * as vueRouter from "vue-router";
import store from "@/store"

const routes: Array<vueRouter.RouteRecordRaw> = [
  { path: "/YoutubeDownload", name: "YoutubeDownload", component: () => import("@/views/YoutubeDownload/YoutubeDownload.vue") },
];

const router = vueRouter.createRouter({
  history: vueRouter.createWebHistory(),
  routes: routes,
});

router.beforeEach((to, from, next) => {
  store.dispatch('showLoading');
  next();
});

router.afterEach(() => {
  setTimeout(() => {
    store.dispatch('hideLoading');
  }, 500); // 模擬延遲，可以根據實際需求調整
});
export default router;
