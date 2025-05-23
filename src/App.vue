<template>
  <div class="viewbody container-fluid p-0">
    <main id="main" role="main">
      <router-view></router-view>
    </main>
  </div>
  <div id="LodingBoard" v-show="isLoading">
    <loding></loding>
  </div>
  <button
    v-if="isShowNav && !isLoginPage && !showNav"
    class="nav-hamburger"
    @click="showNav = true"
  >
    選單
  </button>
  <nav-component
    v-if="isShowNav && !isLoginPage"
    :show="showNav"
    @close="showNav = false"
  />
</template>
<script lang="ts">
import { mapGetters } from "vuex";
import LoadingCustom from "@/components/Loding/Loding.vue";
import Nav from "@/components/Nav/Nav.vue";
import router from "./router";
import type { Router } from "vue-router";
import { Disconnected } from "@/utils/ChatRoomHubHelper";
import { ref } from "vue";

export default {
  components: {
    loding: LoadingCustom,
    navComponent: Nav,
  },
  setup() {
    const showNav = ref(false);
    return { showNav };
  },
  computed: {
    ...mapGetters(["isLoading"]),
    isShowNav(): Router {
      return router;
    },
    isLoginPage(): boolean {
      return (
        router.currentRoute.value.path === "/Login" ||
        router.currentRoute.value.name === "Login"
      );
    },
  },
  beforeUnmount() {
    Disconnected();
  },
};
</script>
<style lang="scss">
@import "@/assets/styles/size.scss";
// header {
//   height: 0;
//   width: 100%;
// }
.viewbody {
  height: 100%;
  width: 100%;
  #main {
    height: 100%;
    width: 100%;
  }
}
#LodingBoard {
  position: fixed;
  top: 0;
  left: 0;
  height: 100%;
  width: 100%;
  z-index: 9999;
  display: flex;
  justify-content: center;
  align-items: center;
  background-color: rgba(0, 0, 0, 0.5); // 新增的半透明背景色
}
.nav-hamburger {
  position: fixed;
  top: calc(50% - 2rem);
  left: 0;
  width: 1rem;
  height: 4rem;
  background: #1976d2;
  color: #fff;
  border: none;
  border-radius: 4px;
  padding: 0 1.2rem;
  font-size: 1.1rem;
  font-weight: 500;
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 2100;
  cursor: pointer;
  transition: background 0.2s;
  &:hover {
    background: #145ea8;
  }
  span {
    display: none;
  }
}
</style>
