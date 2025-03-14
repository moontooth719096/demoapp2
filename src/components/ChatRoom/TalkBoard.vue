<template>
  <div class="card d-flex p-0 flex-column h-100">
    <div
      class="card-header p-0 d-flex justify-content-center align-items-center"
    >
      <i class="bi bi-backspace" @click="backtochatlist"></i>
      <strong class="name col text-truncate align-self-center text-center">{{
        chatroominfo?.nowTalkinfo?.UserName
      }}</strong>
    </div>
    <div
      class="card-body overflow-auto flex-grow-1"
      ref="scrollContainer"
      :model="chatroominfo.nowtalk"
    >
      <div
        class="messagebar d-flex mb-2"
        v-bind:class="
          text.sayid == userInfo.UserID ? 'flex-row-reverse' : ' flex-row'
        "
        v-for="text in chatroominfo.nowtalk"
      >
        <img
          class="userimg img-thumbnail border-1"
          :src="
            text.sayid == userInfo.UserID
              ? userInfo.PicturesPath
              : chatroominfo.nowTalkinfo?.PicturesPath
          "
        />

        <p
          class="talkboard-body border-1 rounded-2 p-1 mx-2 my-auto text-wrap text-start flex-md-column align-self-center"
          v-bind:class="
            text.sayid == userInfo.UserID ? 'messageself' : 'messageorther'
          "
        >
          {{ text.message }}
        </p>
      </div>
    </div>
    <div
      class="card-footer d-flex justify-content-center align-items-center mt-auto"
    >
      <input
        class="form-control flex-grow-1"
        type="text"
        @keydown.enter="sendmessage"
        autocomplete="off"
        v-model="keyonmessage"
        v-bind:disabled="!chatroominfo.nowTalkinfo"
      />
      <button
        class="sendmsgbtn btn btn-primary"
        type="button"
        @click="sendmessage"
        v-bind:disabled="!chatroominfo.nowTalkinfo"
      >
        <i class="bi bi-send"></i>
      </button>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed, ref, watch, nextTick } from "vue";
import store from "@/store";
import { isWhiteSpace } from "@/utils/CheckHelper";
import {
  GetConnectedUsers,
  RefreshChat,
  SendPrivateMessage,
} from "@/utils/ChatRoomHubHelper";
import Swal from "sweetalert2";

const userInfo = computed(() => store.getters.userInfo);
const chatroominfo = computed(() => store.getters.chatRoomInfo);

const keyonmessage = ref<string>(""); //輸入框的值
const scrollContainer = ref<HTMLElement | null>(null);

//發送訊息
const sendmessage = async () => {
  const currentmesage = keyonmessage.value;
  if (isWhiteSpace(currentmesage)) return;
  if (
    !(await SendPrivateMessage(
      chatroominfo.value.nowTalkinfo.UserID ?? "",
      userInfo.value.UserID ?? "",
      currentmesage
    ))
  ) {
    Swal.fire({
      icon: "error",
      text: "傳送訊息失敗",
    });
    return;
  }
  keyonmessage.value = "";
  // 发送消息后，确保滚动到最底部
  nextTick(() => {
    autoScrollToBottom();
  });
};
const autoScrollToBottom = () => {
  if (!scrollContainer.value) return; // 确保 ref 存在
  const container = scrollContainer.value;
  if (container.scrollHeight !== undefined) {
    container.scrollTop = container.scrollHeight; // 滚动到底部
  }
  // 抓取scrollbar的區塊
  //  let container = this.$refs.scrollContainer;
  //  if (container.scrollHeight == undefined)
  //      return;
  //  container.scrollTop = container.scrollHeight;
};

const backtochatlist = () => {
  store.dispatch("clearNowTalk");
};

// 監聽 chatroominfo.nowtalk 的變化
watch(
  () => chatroominfo.value.nowtalk,
  () => {
    // 每當訊息更新時，確保滾動到最底部
    nextTick(() => {
      autoScrollToBottom();
    });
  },
  { deep: true } // 確保每次訊息變化時都會觸發
);
</script>

<style lang="scss" scoped>
@import "@/assets/styles/ChatRoom/TalkBoard.scss";
</style>
