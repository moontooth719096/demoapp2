<template>
  <div class="chatroomdiv d-flex">
    <div id="UsersBoard" class="usersboard" :class="usersBoardClass">
      <userboard></userboard>
    </div>
    <div id="TalkBoard" class="talkboard" :class="talkBoardClass">
      <talkboard></talkboard>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed } from "vue";
import userboard from "@/components/ChatRoom/UserBoard.vue";
import talkboard from "@/components/ChatRoom/TalkBoard.vue";
import store from "@/store";

const chatroominfo = computed(() => store.getters.chatRoomInfo);
const usersBoardClass = computed(() => {
  return chatroominfo.value?.nowTalkinfo?.UserID ? "smallhidden" : "smallshow";
});

const talkBoardClass = computed(() => {
  return chatroominfo.value?.nowTalkinfo?.UserID ? "smallshow" : "smallhidden";
});
</script>

<style lang="scss" scoped>
@import "@/assets/styles/ChatRoom/ChatRoom.scss";
</style>
