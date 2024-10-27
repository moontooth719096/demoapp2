<template>
  <header>
    <nav-component v-if="isShowNav"></nav-component>
  </header>
  <div class="container-fluid p-0">
    <main role="main">
      <router-view></router-view>
      <div id="LodingBoard" v-show="isLoading">
        <loding></loding>
      </div>
    </main>
  </div>
</template>
<script>
import { mapGetters } from "vuex";
import LoadingCustom from "@/components/Loding/Loding.vue";
import Nav from "@/components/Nav/Nav.vue";
import router from "./router";

export default {
  components: {
    loding: LoadingCustom,
    navComponent: Nav,
  },
  computed: {
    ...mapGetters(["isLoading"]),
    isShowNav() {
      return router;
    },
  },
};
</script>
<style lang="css"></style>
