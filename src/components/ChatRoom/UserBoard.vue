<template>
  <div class="card d-flex p-0 flex-column h-100">
    <div class="card-header p-0 d-flex flex-row justify-content-center">
      <img
        class="pic rounded-circle border-1 p-1"
        :src="userInfo.PicturesPath"
      />
      <strong
        class="name col-0 text-truncate d-none d-md-block align-self-center"
        >{{ userInfo.UserName }}</strong
      >
    </div>
    <div class="card-body p-0 overflow-auto flex-grow-1">
      <div
        class="useritem row g-0 border rounded-2 p-1"
        v-for="user in chatroominfo.chatlist"
        :class="{ active: user.UserID == chatroominfo.nowTalkinfo?.UserID }"
        :click="talkselect(user.UserID)"
      >
        <img
          class="item-pic col-12 col-md-3 img-thumbnail rounded-circle border-1 p-1"
          :src="user.PicturesPath"
        />

        <div
          class="item-center col-7 col-md-7 m-0 p-2 d-none d-md-block align-items-center"
        >
          <strong class="d-block text-truncate">{{ user.UserName }}</strong>
          <small class="d-block text-truncate">{{ user.LastMesage }}</small>
        </div>

        <div
          class="otherinfo col-2 col-md-2 d-none d-md-block position-relative"
        >
          <span
            class="badge bg-primary rounded-pill position-absolute top-50 start-50 translate-middle noread"
            v-if="user.NoReadCount > 0"
          >
            {{ user.NoReadCount }}
          </span>
        </div>
      </div>
    </div>
    <div class="card-footer mt-auto">
      <!-- {{ connectionid }} -->
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed } from "vue";
import store from "@/store";
import { ChatRoomInfo } from "@/types/ChatRoom/ChatRoomInfo";
import { UserInfo } from "@/types/UserInfo";
import { RefreshChat } from "@/utils/ChatRoomHubHelper";

const userInfo = computed(() => store.getters.userInfo) as UserInfo;
const chatroominfo = computed(() => store.getters.chatRoomInfo) as ChatRoomInfo;

//設定要聊天的人
const talkselect = async (selectid?: string) => {
  await store.dispatch("talkselect", selectid);
  // await RefreshChat();
  // await store.dispatch("RefreshChat");
};

//刷新當前對話內容
// function refreshChat() {
//     //查詢聊天內容清單中是否有這個聊天對象的聊天室
//     let nowtalks = _.find(talklist, function (o:TalkInfo) { return o.talkid == nowtalkid });//o.talkid.includes(nowtalkid)

//     //如果抓出聊天內容清單中有這個聊天室ID 就將目前聊天的內容設定為這個聊天室的內容
//     if (nowtalks != null && nowtalks != undefined) {
//         nowtalk = _.cloneDeep(nowtalks.talks);
//     }
//     else {
//         nowtalk =null;
//     }

//     // 使用Vue.nextTick確保對話資料渲染完畢後觸發scrollbar保持在最下變
//     this.$nextTick(() => {
//         this.autoScrollToBottom();
//     });
// },
</script>

<style lang="scss" scoped>
@import "@/assets/styles/ChatRoom/UserBoard.scss";
</style>
