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

const props = defineProps<{ show: boolean }>();
const emit = defineEmits(["close"]);

function closeNav() {
  emit("close");
}
</script>

<style lang="scss" scoped>
@import "@/assets/styles/size.scss";

.side-nav {
  position: fixed;
  top: 0;
  left: 0;
  width: 260px;
  height: 100vh;
  background: linear-gradient(135deg, #e3f0ff 0%, #fff 100%);
  box-shadow: 2px 0 16px rgba(25, 118, 210, 0.08);
  transform: translateX(-100%);
  transition: transform 0.3s cubic-bezier(0.4, 0, 0.2, 1);
  z-index: 2001;
  display: flex;
  flex-direction: column;
  border-top-right-radius: 1.2rem;
  border-bottom-right-radius: 1.2rem;
  overflow: hidden;
  &.open {
    transform: translateX(0);
  }
}

.nav-overlay {
  position: fixed;
  top: 0;
  left: 0;
  width: 100vw;
  height: 100vh;
  background: rgba(25, 118, 210, 0.13);
  z-index: 2000;
  backdrop-filter: blur(1px);
}

.side-nav-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 1.2rem 1.2rem 0.7rem 1.2rem;
  border-bottom: 1px solid #e3eaf5;
  background: #f9fbff;
  .navbar-brand {
    font-size: 1.25rem;
    font-weight: 700;
    color: #1976d2;
    letter-spacing: 0.02em;
    text-decoration: none;
    transition: color 0.2s;
    &:hover {
      color: #1256a3;
    }
  }
  .close-btn {
    background: none;
    border: none;
    font-size: 2.1rem;
    line-height: 1;
    cursor: pointer;
    color: #888;
    transition: color 0.2s;
    &:hover {
      color: #1976d2;
    }
  }
}

.side-nav-list {
  list-style: none;
  padding: 1.2rem 1.2rem 0 1.2rem;
  margin: 0;
  flex: 1;
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
  li {
    margin: 0;
  }
  .nav-link {
    display: block;
    padding: 0.85rem 0.7rem;
    color: #333;
    text-decoration: none;
    font-size: 1.13em;
    border-radius: 0.5rem;
    transition: background 0.18s, color 0.18s;
    &:hover {
      background: #e3f0ff;
      color: #1976d2;
    }
    &.router-link-active {
      font-weight: bold;
      color: #1976d2;
      background: #e3f0ff;
    }
  }
  .btn {
    margin-top: 2rem;
    width: 100%;
    border-radius: 0.6rem;
    font-size: 1.08rem;
    font-weight: 600;
    padding: 0.7rem 0;
    background: #1976d2;
    border: none;
    color: #fff;
    transition: background 0.2s;
    &:hover {
      background: #1256a3;
    }
  }
}

// 響應式設計
@include respond-to(xs) {
  .side-nav {
    width: 90vw;
    min-width: 0;
    border-radius: 0 1.2rem 1.2rem 0;
  }
  .side-nav-header {
    padding: 1rem 0.7rem 0.5rem 0.7rem;
    .navbar-brand {
      font-size: 1.1rem;
    }
    .close-btn {
      font-size: 1.7rem;
    }
  }
  .side-nav-list {
    padding: 1rem 0.7rem 0 0.7rem;
    .nav-link {
      font-size: 1em;
      padding: 0.7rem 0.5rem;
    }
    .btn {
      font-size: 1em;
      padding: 0.6rem 0;
    }
  }
}
@include respond-to(sm) {
  .side-nav {
    width: 70vw;
    min-width: 0;
  }
  .side-nav-header {
    padding: 1.1rem 1rem 0.6rem 1rem;
  }
  .side-nav-list {
    padding: 1.1rem 1rem 0 1rem;
  }
}
@include respond-to(md) {
  .side-nav {
    width: 300px;
  }
}
@include respond-to(lg) {
  .side-nav {
    width: 320px;
  }
}
</style>
