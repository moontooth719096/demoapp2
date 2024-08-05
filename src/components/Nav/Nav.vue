<template>
  <nav class="navbar navbar-expand-sm navbar-toggleable-sm border-bottom box-shadow bg-puttinghead">
    <div class="container-fluid">
      <router-link class="navbar-brand" to="/">DemoProgressBar</router-link>
      <button
        class="navbar-toggler"
        type="button"
        data-bs-toggle="collapse"
        data-bs-target=".navbar-collapse"
        aria-controls="navbarSupportedContent"
        aria-expanded="false"
        aria-label="Toggle navigation">
        <span class="navbar-toggler-icon"></span>
      </button>
      <div class="navbar-collapse collapse d-sm-inline-flex justify-content-between">
        <ul class="navbar-nav flex-grow-1">
          <li class="nav-item">
            <a class="nav-link text-dark" asp-area="" asp-page="/ChatRoom/Index">ChatRoom</a>
          </li>
          <li class="nav-item">
            <router-link class="nav-link text-dark" to="/YoutubeDownload">YTDownload</router-link>
          </li>
        </ul>
      </div>
      <div class="navbar-collapse collapse d-sm-inline-flex justify-content-end">
        <ul class="navbar-nav d-flex justify-content-end flex-grow-1">
          <li class="nav-item">
            <button class="btn btn-primary" onclick="AppLogOut()">登出</button>
          </li>
        </ul>
      </div>
    </div>
  </nav>
</template>

<script setup lang="ts"></script>

<style scoped></style>
