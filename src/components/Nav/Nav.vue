<template>
  <div>
    <div class="nav-overlay" v-if="show" @click="closeNav"></div>
    <nav :class="['side-nav', { open: show }]">
      <div class="side-nav-header">
        <router-link class="navbar-brand" to="/">DemoProgressBar</router-link>
        <button class="close-btn" @click="closeNav">×</button>
      </div>
      <ul class="side-nav-list">
        <li>
          <router-link class="nav-link" to="/ChatRoom" @click="closeNav"
            >ChatRoom</router-link
          >
        </li>
        <li>
          <router-link class="nav-link" to="/YoutubeDownload" @click="closeNav"
            >YTDownload</router-link
          >
        </li>
        <li>
          <router-link
            class="nav-link"
            to="/BakingConversionCalculator"
            @click="closeNav"
            >食譜尺寸換算工具</router-link
          >
        </li>
        <li style="margin-top: 2rem">
          <button class="btn btn-primary w-100" @click="AppLogOut">登出</button>
        </li>
      </ul>
    </nav>
  </div>
</template>

<script setup lang="ts">
import { AppLogOut } from "@/utils/Auth";
import { defineProps, defineEmits } from "vue";

const props = defineProps<{ show: boolean }>();
const emit = defineEmits(["close"]);

function closeNav() {
  emit("close");
}
</script>

<style scoped>
.side-nav {
  position: fixed;
  top: 0;
  left: 0;
  width: 240px;
  height: 100vh;
  background: #fff;
  box-shadow: 2px 0 8px rgba(0, 0, 0, 0.08);
  transform: translateX(-100%);
  transition: transform 0.3s cubic-bezier(0.4, 0, 0.2, 1);
  z-index: 2001;
  display: flex;
  flex-direction: column;
}
.side-nav.open {
  transform: translateX(0);
}
.nav-overlay {
  position: fixed;
  top: 0;
  left: 0;
  width: 100vw;
  height: 100vh;
  background: rgba(0, 0, 0, 0.25);
  z-index: 2000;
}
.side-nav-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 1rem 1rem 0.5rem 1rem;
  border-bottom: 1px solid #eee;
}
.close-btn {
  background: none;
  border: none;
  font-size: 2rem;
  line-height: 1;
  cursor: pointer;
  color: #888;
}
.side-nav-list {
  list-style: none;
  padding: 1rem;
  margin: 0;
  flex: 1;
}
.nav-link {
  display: block;
  padding: 0.75rem 0;
  color: #333;
  text-decoration: none;
  font-size: 1.1em;
}
.nav-link.router-link-active {
  font-weight: bold;
  color: #1976d2;
}
</style>
