import { createStore } from "vuex"; // 引入 Vuex 的 createStore 方法
import { UserInfo } from "@/types/UserInfo";
import { ChatRoomInfo } from "@/types/ChatRoom/ChatRoomInfo";
import {ChatInfo} from "@/types/ChatRoom/ChatInfo";
import type { TalkInfo, TalkContentInfo,SingleTalkInfo,NowTalkInfo } from "@/types/ChatRoom/TalkInfo";
import _ from "lodash";
import {HubConnection} from "@microsoft/signalr";
import { GetConnectedUsers,AddTalk,RefreshChat} from "@/utils/ChatRoomHubHelper";

export interface statetype{
  userInfo:UserInfo,
  isLoading:boolean,
  chatRoomInfo:ChatRoomInfo
}



function resetstate():statetype {
  return{
   isLoading: false, // 這是一個布爾值，表示是否顯示 Loading 區塊
    userInfo: new UserInfo(),
    chatRoomInfo:new ChatRoomInfo(),
  }
}

// 使用 createStore 方法創建一個新的 Vuex store
export default createStore<statetype>({
  // state: 定義應用程序的狀態
  state:resetstate(),
  // mutations: 定義改變狀態的同步方法
  mutations: {
    // setLoading: 修改 isLoading 狀態
    setLoading(state, payload:boolean) {
      state.isLoading = payload;
    },
    setUserInfo(state, payload:UserInfo) {
      state.userInfo = payload;
    },
    setConnection(state, payload:HubConnection) {
      if(state.chatRoomInfo){
        state.chatRoomInfo.connection = payload;
      }
    },
    setChatlist(state, payload:Array<ChatInfo>) {
      if(state.chatRoomInfo){
        state.chatRoomInfo.chatlist = payload;
      }
    },
    // setNowtalkid(state, payload:string) {
    //   if(state.chatRoomInfo){
    //     state.chatRoomInfo.nowtalkid = payload;
    //   }
    // },
    setNowtalkInfo(state, payload:NowTalkInfo) {
      if(state.chatRoomInfo){
        state.chatRoomInfo.nowTalkinfo = payload;
      }
    },
    //增加新的聊天室
    pushTalklist(state, payload:TalkInfo) {
      if(state.chatRoomInfo?.talklist){
        state.chatRoomInfo.talklist?.push(payload);
      }
    },
    //增加新一句對話
    pushTalk(state, payload:SingleTalkInfo) {
      if(state.chatRoomInfo?.talklist){
        state.chatRoomInfo.talklist.find(x=>x.talkid ==payload.talkid)?.talks.push(payload);
      }
    },
    setNowtalk(state, payload:TalkContentInfo) {
      if(state.chatRoomInfo){
        state.chatRoomInfo.nowtalk = payload;
      }
    },
    // updateChatUserInfo(state, payload:ChatInfo) {
    //   if(state.chatRoomInfo){
    //     state.chatRoomInfo.nowtalk = payload;
    //   }
    // },
    RESET_STATE(state) {
      Object.assign(state, resetstate());
    },
  },
  // actions: 定義觸發 mutation 的方法，可以是同步或異步
  actions: {
    // showLoading: 觸發 setLoading mutation 並將 isLoading 設為 true
    showLoading({ commit }) {
      commit("setLoading", true);
    },
    // hideLoading: 觸發 setLoading mutation 並將 isLoading 設為 false
    hideLoading({ commit }) {
      commit("setLoading", false);
    },
    clearUserInfo({ commit }) {
      commit("setUserInfo", null);
    },
    LogOut({ commit }) {
      commit("RESET_STATE");
    },
    async pushChatlist({ commit },onlineuser:ChatInfo) {
         if(this.state.chatRoomInfo){
            let currentchatRoomInfo = this.state.chatRoomInfo.chatlist;
            if(!currentchatRoomInfo){
                currentchatRoomInfo = new Array<ChatInfo>();
            }
            currentchatRoomInfo.push(onlineuser);
            commit("setChatlist",currentchatRoomInfo);  
         }
      commit("setUserInfo", onlineuser);
    },
    refreshChatlist({ commit },onlineusers:Array<ChatInfo>) {
       console.log('vuex_refreshChatlist');
         if(this.state.chatRoomInfo){
            let nowchatlist = onlineusers.filter(x => x.UserID !== this.state.userInfo.UserID);
            commit("setChatlist",nowchatlist);  
         }
    },
    UserDisconnected({ commit },offlineuserid:ChatInfo) {
         if(this.state.chatRoomInfo){
            let currentchatRoomInfo = this.state.chatRoomInfo.chatlist as Array<ChatInfo>;
            if(currentchatRoomInfo){
              const index = currentchatRoomInfo.findIndex(item => item.UserID === offlineuserid.UserID);
              if(index){
                 currentchatRoomInfo.splice(index, 1);
                  commit("setChatlist",currentchatRoomInfo); 
              }
            }
         }
    },
    async talkselect({ commit },selectid:String) {
      console.log('vuex_talkselect');
      //判斷使用者清單沒有這個人就刷新，如果刷了一次還是沒有，就跳過
      let istry = false as boolean;
      while(!this.state.chatRoomInfo.chatlist?.some(x=>x.UserID ==selectid)){
        await  GetConnectedUsers();
        //判斷確定沒人，不處理
          if(istry){
            return;
          }
          istry = true;
      }
      //如果有確定有人，抓出那個人的資料
      const user = this.state.chatRoomInfo.chatlist?.find(x=>x.UserID ==selectid) as ChatInfo;
      if(user?.NoReadCount > 0)
        user.NoReadCount = 0;
      const nowTalkInfo:NowTalkInfo={
        UserID:user?.UserID??"",
        PicturesPath:user?.PicturesPath??""
      };
      commit("setNowtalkInfo",nowTalkInfo);
      // RefreshChat();
    },
    async PrivateMessage({ commit },messageinfo:SingleTalkInfo) {
        //判斷使用者清單沒有這個人就刷新，如果刷了一次還是沒有，就跳過
        let istry = false as boolean;
        while(!this.state.chatRoomInfo.chatlist?.some(x=>x.UserID ==messageinfo.talkid)){
          await  GetConnectedUsers();
          //判斷確定沒人，不處理
            if(istry){
              return;
            }
            istry = true;
        }
        //如果有確定有人，抓出那個人的資料
        const user = this.state.chatRoomInfo.chatlist?.find(x=>x.UserID ==messageinfo.talkid) as ChatInfo;
         if (this.state.chatRoomInfo.nowTalkinfo?.UserID!= messageinfo.talkid){
            user.NoReadCount = user.NoReadCount + 1;
         }
        user.LastMesage = messageinfo.message;
        //將收到的訊息加到對話清單裡
        AddTalk(messageinfo.talkid, messageinfo.sayid, messageinfo.message);
        //判斷目前沒有選擇跟任何人聊天,就給目前私訊你的人
        if (!this.state.chatRoomInfo.nowTalkinfo) {
            const nowTalkInfo:NowTalkInfo={
              UserID:user?.UserID??"",
              PicturesPath:user?.PicturesPath??""
            };
              commit("setNowtalkInfo",nowTalkInfo);
        }
    },
    AddTalk({ commit },messageinfo:SingleTalkInfo) {
        let talk = this.state.chatRoomInfo.talklist?.find(x=>x.talkid ==messageinfo.talkid) as TalkInfo;
        if (talk) {
            const currenttalkcontent:TalkContentInfo = {
                sayid:messageinfo.sayid,
                message:messageinfo.message
            }
            talk.talks.push(currenttalkcontent);
        }
        else {
            const user = this.state.chatRoomInfo.chatlist?.find(x=>x.UserID ==messageinfo.talkid) as ChatInfo;
            const talk:TalkInfo = { talkid: messageinfo.talkid??"",talkImgPath:user.PicturesPath??"",talks: [{ sayid: messageinfo.sayid, message: messageinfo.message }] };
            commit("pushTalklist",talk);
        }

        //  if (talk.talkid == this.state.chatRoomInfo.nowtalkid )
        //     RefreshChat();
    },
    RefreshChat({ commit }) {
      console.log('vuex_RefreshChat');
      let nowtalks = this.state.chatRoomInfo.talklist?.find(x=>x.talkid == this.state.chatRoomInfo.nowTalkinfo?.UserID);
    
      //如果抓出聊天內容清單中有這個聊天室ID 就將目前聊天的內容設定為這個聊天室的內容
      if (nowtalks) {
        commit("setNowtalk",_.cloneDeep(nowtalks.talks));
      }
      else {
        commit("setNowtalk",[]);
      }
    },
  },
  // getters: 定義獲取狀態的方法（類似於計算屬性）
  getters: {
    // isLoading: 返回 isLoading 狀態
    isLoading: (state) => state.isLoading,
    userInfo: (state) => state.userInfo,
    chatRoomInfo:(state) => state.chatRoomInfo
  },
});
