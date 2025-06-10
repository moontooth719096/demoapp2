<template>
  <div class="card d-flex p-0 flex-column h-100">
    <div
      class="card-header p-0 d-flex justify-content-center align-items-center"
    >
      <i class="bi bi-backspace"></i>
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
    <div class="card-footer d-flex justify-content-center align-items-end">
      <div class="emojidropup dropup">
        <button
          type="button"
          class="btn"
          data-bs-toggle="dropdown"
          aria-expanded="false"
        >
          😀
        </button>
        <div class="emojiboard dropdown-menu">
          <template v-for="(emoji, index) in emojilist">
            <button class="btn p-0" @click="insertEmoji(emoji)">
              {{ emoji }}
            </button>
          </template>
        </div>
      </div>

      <textarea
        class="form-control msg-areabox flex-grow-1"
        @keydown.enter="sendmessage"
        autocomplete="off"
        v-model="keyonmessage"
        v-bind:disabled="!chatroominfo.nowTalkinfo"
        rows="1"
        ref="msgarea"
      ></textarea>
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
import { SendPrivateMessage } from "@/utils/ChatRoomHubHelper";
import Swal from "sweetalert2";

const userInfo = computed(() => store.getters.userInfo);
const chatroominfo = computed(() => store.getters.chatRoomInfo);

const keyonmessage = ref<string>(""); //輸入框的值
const scrollContainer = ref<HTMLElement | null>(null);
const msgarea = ref<HTMLElement | null>(null);

// 表情符號清單

const emojilist = ref<string[]>([
  "😀",
  "😁",
  "😂",
  "🤣",
  "😃",
  "😄",
  "😅",
  "😆",
  "😉",
  "😊",
  "😋",
  "😎",
  "😍",
  "😘",
  "😗",
  "😙",
  "😚",
  "☺️",
  "🙂",
  "🤗",
  "🤩",
  "🤔",
  "🤨",
  "😐",
  "😑",
  "😶",
  "🙄",
  "😏",
  "😣",
  "😥",
  "😮",
  "🤐",
  "😯",
  "😪",
  "😫",
  "😴",
  "😌",
  "😛",
  "😜",
  "😝",
  "🤤",
  "😒",
  "😓",
  "😔",
  "😕",
  "🙃",
  "🤑",
  "😲",
  "☹️",
  "🙁",
  "😖",
  "😞",
  "😟",
  "😤",
  "😢",
  "😭",
  "😦",
  "😧",
  "😨",
  "😩",
  "🤯",
  "😬",
  "😰",
  "😱",
  "😳",
  "🤪",
  "😵",
  "😡",
  "😠",
  "🤬",
  "😷",
  "🤒",
  "🤕",
  "🤢",
  "🤮",
  "🤧",
  "😇",
  "🤠",
  "🤡",
  "🤥",
  "🤫",
  "🤭",
  "🧐",
  "🤓",
  "😈",
  "👿",
  "👹",
  "👺",
  "💀",
  "👻",
  "👽",
  "🤖",
  "💩",
  "😺",
  "😸",
  "😹",
  "😻",
  "😼",
  "😽",
  "🙀",
  "😿",
  "😾",
  "🙈",
  "🙉",
  "🙊",
  "💋",
  "💌",
  "💘",
  "💝",
  "💖",
  "💗",
  "💓",
  "💞",
  "💕",
  "💟",
]);

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
};

const insertEmoji = (emoji: any) => {
  if (!msgarea.value) return; // 确保 ref 存在
  const textarea = msgarea.value as HTMLTextAreaElement;
  const start = textarea.selectionStart;
  const end = textarea.selectionEnd;
  // 插入 Emoji
  keyonmessage.value =
    textarea.value.substring(0, start) + emoji + textarea.value.substring(end);
  // 移動游標位置
  textarea.selectionStart = textarea.selectionEnd = start + emoji.length;
  textarea.focus(); // 然後再重新 focus
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

// 監聽 keyonmessage 的變化，調整 textarea 的高度
watch(keyonmessage, () => {
  nextTick(() => {
    if (!msgarea.value) return; // 确保 ref 存在
    const textarea = msgarea.value as HTMLTextAreaElement;
    textarea.style.height = "auto";
    if (textarea) {
      if (keyonmessage.value && keyonmessage.value.length > 0) {
        const currentHeight = parseFloat(getComputedStyle(textarea).height);

        textarea.style.height = `${textarea.scrollHeight}px`;

        textarea.scrollTop = textarea.scrollHeight; // 確保滾動條在最底部
      }
    }
  });
});
</script>

<style lang="scss" scoped>
@import "@/assets/styles/ChatRoom/TalkBoard.scss";
</style>
