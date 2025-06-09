<template>
  <div
    v-if="isChatConnected && !isChatRoomPage"
    class="chat-icon-wrapper"
    @click="goToChatRoom"
  >
    <i class="bi bi-chat-dots-fill"></i>
    <span v-if="hasUnread" class="chat-unread-dot"></span>
  </div>
</template>

<script setup lang="ts">
import { computed, ref, onMounted, onUnmounted } from "vue";
import { useStore } from "vuex";
import { useRouter, useRoute } from "vue-router";
import { IsConnected } from "@/utils/ChatRoomHubHelper";

const store = useStore();
const router = useRouter();
const route = useRoute();
const hasUnread = computed(() => {
  const chatlist = store.state.chatRoomInfo?.chatlist || [];
  return chatlist.some((item: any) => item.NoReadCount > 0);
});
const isChatRoomPage = computed(() => route.name === "ChatRoom");

// 取得 chatRoomConnection 狀態
const isChatConnected = ref(IsConnected());
let intervalId: any = null;

onMounted(() => {
  // 定時檢查連線狀態，讓 isChatConnected 具備 reactivity
  intervalId = setInterval(() => {
    isChatConnected.value = IsConnected();
  }, 500); // 每 0.5 秒檢查一次
});
onUnmounted(() => {
  if (intervalId) clearInterval(intervalId);
});

function goToChatRoom() {
  // 1. 跳轉到 ChatRoom 頁面
  router.push({ name: "ChatRoom" });
  // 2. 將所有 chatlist 的 NoReadCount 歸零
  const chatlist = store.state.chatRoomInfo?.chatlist || [];
  chatlist.forEach((item: any) => {
    if (item.NoReadCount > 0) item.NoReadCount = 0;
  });
  // 3. 觸發 vuex 更新（如有需要可 dispatch/commit）
  store.commit("setChatlist", chatlist);
}
</script>

<style scoped>
.chat-icon-wrapper {
  position: relative;
  display: flex;
  align-items: center;
  justify-content: center;
  width: 2.5rem;
  height: 2.5rem;
}
.chat-icon-wrapper i {
  font-size: 2rem;
  display: block;
  margin: 0;
}
.chat-unread-dot {
  position: absolute;
  top: 0.1rem;
  right: 0.1rem;
  width: 0.6rem;
  height: 0.6rem;
  background: #ff3b30;
  border-radius: 50%;
  box-shadow: 0 0 4px #ff3b30;
  z-index: 2;
  animation: blink-dot 1s infinite alternate;
}

@keyframes blink-dot {
  0% {
    opacity: 1;
    box-shadow: 0 0 4px #ff3b30;
  }
  100% {
    opacity: 0;
    box-shadow: 0 0 4px #ff3b30;
  }
}
</style>
