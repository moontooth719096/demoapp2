<template>
  <nav
    style="height: 100%"
    class="navbar navbar-expand-sm navbar-toggleable-sm border-bottom box-shadow bg-puttinghead"
  >
    <div class="container-fluid">
      <router-link class="navbar-brand" to="/">DemoProgressBar</router-link>
      <button
        class="navbar-toggler"
        type="button"
        data-bs-toggle="collapse"
        data-bs-target=".navbar-collapse"
        aria-controls="navbarSupportedContent"
        aria-expanded="false"
        aria-label="Toggle navigation"
      >
        <span class="navbar-toggler-icon"></span>
      </button>
      <div
        class="navbar-collapse collapse d-sm-inline-flex justify-content-between"
      >
        <ul class="navbar-nav flex-grow-1">
          <li class="nav-item">
            <router-link class="nav-link text-dark" to="/ChatRoom"
              >ChatRoom</router-link
            >
          </li>
          <li class="nav-item">
            <router-link class="nav-link text-dark" to="/YoutubeDownload"
              >YTDownload</router-link
            >
          </li>
        </ul>
      </div>
      <div
        class="navbar-collapse collapse d-sm-inline-flex justify-content-end"
      >
        <ul class="navbar-nav d-flex justify-content-end flex-grow-1">
          <li class="nav-item">
            <button class="btn btn-primary" @click="AppLogOut">登出</button>
          </li>
          <!-- <li class="nav-item">
            <button @click="toggleDarkMode">切換暗黑模式</button>
          </li> -->
        </ul>
      </div>
    </div>
  </nav>
</template>

<script setup lang="ts">
import { ref } from "vue";
import { AppLogOut } from "@/utils/Auth";

const isDarkMode = ref<boolean>(false);

const toggleDarkMode = () => {
  isDarkMode.value = !isDarkMode.value;
  if (isDarkMode.value) {
    document.body.classList.add("dark-mode");
  } else {
    document.body.classList.remove("dark-mode");
  }
};
</script>

<style scoped>

button {
  margin-left: auto;
  padding: 0.5rem 1rem;
  cursor: pointer;
}
</style>
