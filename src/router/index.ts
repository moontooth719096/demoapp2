import * as vueRouter from "vue-router";
import store from "@/store";
import { AppLoginCheck } from "@/utils/Auth";
import Home from "@/views/Home/Home.vue";
import Login from "@/views/Login/Login.vue";

export enum PathKeyType {
  "Home" = "Home",
  "Login" = "Login",
  "YoutubeDownload" = "YoutubeDownload",
  "ChatRoom" = "ChatRoom",
}

const routes: Array<vueRouter.RouteRecordRaw> = [
  { path: "/", name: PathKeyType.Home.toString(), component: Home },
  { path: "/Login", name: PathKeyType.Login.toString(), component: Login, meta: { hideMenu: true } },
  { path: "/YoutubeDownload", name: PathKeyType.YoutubeDownload.toString(), component: () => import("@/views/YoutubeDownload/YoutubeDownload.vue") },
  { path: "/ChatRoom", name: PathKeyType.ChatRoom.toString(), component: () => import("@/views/ChatRoom/ChatRoom.vue") },
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
