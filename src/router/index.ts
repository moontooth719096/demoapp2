import * as vueRouter from "vue-router";
import store from "@/store";
import { AppLoginCheck } from "@/utils/Auth";

export enum PathKeyType {
  "Home" = "Home",
  "Login" = "Login",
  "YoutubeDownload" = "YoutubeDownload",
}

const routes: Array<vueRouter.RouteRecordRaw> = [
  { path: "/", name: PathKeyType.Home.toString(), component: () => import("@/views/Home/Home.vue") },
  { path: "/Login", name: PathKeyType.Login.toString(), component: () => import("@/views/Login/Login.vue") },
  { path: "/YoutubeDownload", name: PathKeyType.YoutubeDownload.toString(), component: () => import("@/views/YoutubeDownload/YoutubeDownload.vue") },
];

const router = vueRouter.createRouter({
  history: vueRouter.createWebHistory(),
  routes: routes,
});

router.beforeEach(async (to, from, next) => {
  if (to.name === "Login") next();
  if (await AppLoginCheck()) {
    store.dispatch("showLoading");
    next();
  } else next({ name: PathKeyType.Login.toString() });
});

router.afterEach(() => {
  setTimeout(() => {
    store.dispatch("hideLoading");
  }, 500); // 模擬延遲，可以根據實際需求調整
});
export default router;
