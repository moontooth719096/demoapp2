import * as vueRouter from "vue-router";

const routes: RouteRecordRaw[] = [{ path: "/YoutubeDownload", component: () => import("@/views/YoutubeDownload/YoutubeDownload.vue") }];

const router = vueRouter.createRouter({
  history: vueRouter.createWebHistory(),
  routes: routes,
});
export default router;
