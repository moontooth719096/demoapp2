import * as vueRouter from "vue-router";
import store from "@/store";
import { AppLoginCheck } from "@/utils/Auth";
import Home from "@/views/Home/Home.vue";
import Login from "@/views/Login/Login.vue";
import BCC from "@/views/BakingConversionCalculator.vue";

export enum PathKeyType {
  "Home" = "/",
  "Login" = "Login",
  "YoutubeDownload" = "YoutubeDownload",
  "ChatRoom" = "ChatRoom",
  "LogView" = "LogView",
  "BCC" = "BCC",
}

const routes: Array<vueRouter.RouteRecordRaw> = [
  { path: "/", name: PathKeyType.Home.toString(), component: Home },
  { path: "/Login", name: PathKeyType.Login.toString(), component: Login },
  {
    path: "/YoutubeDownload",
    name: PathKeyType.YoutubeDownload.toString(),
    component: () => import("@/views/YoutubeDownload/YoutubeDownload.vue"),
  },
  {
    path: "/ChatRoom",
    name: PathKeyType.ChatRoom.toString(),
    component: () => import("@/views/ChatRoom/ChatRoom.vue"),
  },
  {
    path: "/LogView",
    name: PathKeyType.LogView.toString(),
    component: () => import("@/views/LogViewer/LogViewer.vue"),
  },
  {
    path: "/BCC",
    name: PathKeyType.BCC.toString(),
    component: () => BCC,
  },
];

const router = vueRouter.createRouter({
  history: vueRouter.createWebHistory(),
  routes: routes,
});

router.beforeEach(async (to, from, next) => {
  if (to.name === "Login") {
    next();
    return;
  }
  if (await AppLoginCheck()) {
    store.dispatch("showLoading");
    next();
  } else next({ name: PathKeyType.Login.toString() });
});

router.afterEach(() => {
  setTimeout(() => {
    store.dispatch("hideLoading");
  }, 500);
});
export default router;
