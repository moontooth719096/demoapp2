<template>
  <header>
    <nav-component v-if="isShowNav && !isLoginPage"></nav-component>
  </header>
  <div class="container-fluid p-0">
    <main id="main" role="main">
      <router-view></router-view>
    </main>
  </div>
  <div id="LodingBoard" v-show="isLoading">
    <loding></loding>
  </div>
</template>
<script lang="ts">
import { mapGetters } from "vuex";
import LoadingCustom from "@/components/Loding/Loding.vue";
import Nav from "@/components/Nav/Nav.vue";
import router from "./router";
import type { Router } from "vue-router";
import { Disconnected } from "@/utils/ChatRoomHubHelper";

export default {
  components: {
    loding: LoadingCustom,
    navComponent: Nav,
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
header {
  height: 10%;
  width: 100%;
}
.container-fluid {
  height: 90%;
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
}
</style>
