<template>
  <div class="chatroomdiv d-flex">
    <div id="UsersBoard" class="usersboard">
      <userboard></userboard>
    </div>
    <div id="TalkBoard" class="talkboard">
      <talkboard></talkboard>
    </div>
  </div>
</template>

<script setup lang="ts">
import userboard from "@/components/ChatRoom/UserBoard.vue";
import talkboard from "@/components/ChatRoom/TalkBoard.vue";
</script>

<style lang="scss" scoped>
@import "@/assets/styles/ChatRoom/ChatRoom.scss";
</style>
