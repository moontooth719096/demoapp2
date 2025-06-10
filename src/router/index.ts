import * as vueRouter from "vue-router";
import store from "@/store";
import { AppLoginCheck } from "@/utils/Auth";
import Home from "@/views/Home.vue";
import Login from "@/views/Login.vue";

export enum PathKeyType {
  "Home" = "/",
  "Login" = "Login",
}

// 動態自動載入 views 目錄下所有 .vue 頁面
const views = import.meta.glob("@/views/**/*.vue");

const staticRoutes: Array<vueRouter.RouteRecordRaw> = [
  { path: "/", name: PathKeyType.Home.toString(), component: Home },
  { path: "/Login", name: PathKeyType.Login.toString(), component: Login },
];

const dynamicRoutes: Array<vueRouter.RouteRecordRaw> = Object.entries(views)
  .map(([path, component]) => {
    const match = path.match(/\/views\/(.+)\.vue$/);
    if (!match) return undefined;
    const name = match[1].replace(/\//g, "");
    // 避免重複註冊 Home、Login、BCC
    if (["HomeHome", "LoginLogin"].includes(name)) return undefined;
    return {
      path: `/${name}`,
      name,
      component,
    } as vueRouter.RouteRecordRaw;
  })
  .filter((r): r is vueRouter.RouteRecordRaw => !!r);

const routes: Array<vueRouter.RouteRecordRaw> = [
  ...staticRoutes,
  ...dynamicRoutes,
];

const router = vueRouter.createRouter({
  history: vueRouter.createWebHistory(),
  routes: routes,
});

// 離開 ChatRoom 頁面時清空 nowtalk
router.beforeEach(async (to, from, next) => {
  // 如果上一頁是 ChatRoom，且即將離開
  if (from.name === "ChatRoom" && to.name !== "ChatRoom") {
    store.dispatch("clearNowTalk");
  }
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
