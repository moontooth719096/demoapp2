<template>
  <div class="card d-flex flex-column">
    <div class="card-header"></div>
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
            text == userInfo.UserID
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
        送出
      </button>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed, ref } from "vue";
import store from "@/store";
import { ChatRoomInfo } from "@/types/ChatRoom/ChatRoomInfo";
import { UserInfo } from "@/types/UserInfo";
import { isWhiteSpace } from "@/utils/CheckHelper";
import {
  GetConnectedUsers,
  AddTalk,
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
};
// const autoScrollToBottom = () => {
//   if (!scrollContainer.value) return; // 确保 ref 存在
//   const container = scrollContainer.value;
//   if (container.scrollHeight !== undefined) {
//     container.scrollTop = container.scrollHeight; // 滚动到底部
//   }
//   // 抓取scrollbar的區塊
//   //  let container = this.$refs.scrollContainer;
//   //  if (container.scrollHeight == undefined)
//   //      return;
//   //  container.scrollTop = container.scrollHeight;
// };
</script>

<style lang="scss" scoped>
@import "@/assets/styles/ChatRoom/TalkBoard.scss";
</style>
