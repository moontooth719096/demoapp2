<template>
  <header>
    <nav-component></nav-component>
  </header>
  <div class="container-fluid p-0">
    <main role="main">
      <router-view></router-view>
      <div id="LodingBoard" style="display: none" v-show="isLoading">
        <loding></loding>
      </div>
      <button v-on:click="toggleLoading"></button>
    </main>
  </div>
</template>
<script>
import { mapGetters, mapActions } from 'vuex';

export default {
  computed: {
    ...mapGetters(['isLoading']),
  },
  methods: {
    ...mapActions(['showLoading', 'hideLoading']),
    toggleLoading() {
      if (this.isLoading) {
        this.hideLoading();
      } else {
        this.showLoading();
      }
    },
  },
};
</script>
<style lang="css">
:root {
  --puddinghead-color: #6c0609;
  --puddingbody-color: #faf49c;
}

* {
  box-sizing: border-box;
  margin: 0;
  padding: 0;
}

/*
  .bg-puttingbody{
      background-color:var(--puddingbody-color) ;
  }
  
  .bg-puttinghead {
      background-color: var(--puddinghead-color);
  }*/
@media (perfers-color-scheme: dark) {
  body {
    background: #333;
    color: #fff;
  }
}
html {
  /*position: relative;*/
  width: 100%;
  height: 100%;
}
html body {
  width: 100%;
  height: 100%;
}

@media (max-width: 768px) {
  html {
    font-size: 16px;
  }
}

.zoomimage {
  background-size: cover;
  background-position: center center;
  background-repeat: no-repeat;
  -webkit-background-size: cover;
  -moz-background-size: cover;
}
#LodingBoard {
  position: fixed;
  display: flex;
  top: 0%;
  left: 0%;
  width: 100%;
  height: 100%;
  background-color: rgb(0, 0, 0, 0.3);
  z-index: 9999;
  justify-content: center;
  align-items: center;
}
</style>
