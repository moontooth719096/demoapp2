import { computed } from "vue";
import store from "@/store";
import {
  HttpTransportType,
  HubConnectionBuilder,
  HubConnectionState,
} from "@microsoft/signalr";
import { getTokenCookie } from "@/utils/cookie";
import { ChatInfo } from "@/types/ChatRoom/ChatInfo";
import { UserInfo } from "@/types/UserInfo";
import type { SingleTalkInfo } from "@/types/ChatRoom/TalkInfo";
import { Log } from "@/utils/Log";

const userInfo = computed(() => store.getters.userInfo) as UserInfo;
const chatroomhuburl = new URL(
  import.meta.env.VITE_ChatHubUri,
  import.meta.env.VITE_API_BASE_URL
)?.href;
const chatRoomConnection = new HubConnectionBuilder()
  .withUrl(chatroomhuburl, {
    accessTokenFactory: () => {
      const token = getTokenCookie();
      if (token) {
        return token; // 返回有效的字串
      } else {
        throw new Error("Token is null or undefined");
      }
    },
    skipNegotiation: true,
    transport: HttpTransportType.WebSockets,
  })
  .withAutomaticReconnect()
  .build();
//建立聊天室signalR連線
export function Start() {
  if (chatRoomConnection.state !== HubConnectionState.Disconnected) {
    console.log("聊天室已經連線");
    return;
  }
  // chatRoomConnection.onclose(async () => {
  //         Disconnected();//窗口关闭断开通信
  // });
  chatRoomConnection.on(
    "RefreshConnectList",
    function (onlinelist: Array<ChatInfo>) {
      store.dispatch("refreshChatlist", onlinelist);
    }
  );
  //監聽使用者離線
  chatRoomConnection.on("UserDisconnected", function (offlineuserid: string) {
    store.dispatch("UserDisconnected", offlineuserid);
  });
  //監聽私訊訊息
  chatRoomConnection.on(
    "PrivateMessage",
    async function (senduser: ChatInfo, message: string) {
      await UpdatePrivateMessage(
        senduser.UserID ?? "",
        senduser.UserID ?? "",
        message
      );
    }
  );
  chatRoomConnection
    .start()
    .then(() => {
      GetConnectedUsers();
      Log(`聊天室連接已建立`, 2);
      console.log("聊天室連接已建立");
    })
    .catch((error: any) => {
      Log(`聊天室連接失敗:${error}`, 4);
      console.error("聊天室連接失敗:", error);
    });
}
export function Disconnected() {
  // chatRoomConnection.invoke("OnDisconnect").catch(err => console.error(err));
  chatRoomConnection.stop();
}
export async function GetConnectedUsers() {
  try {
    const getresult = await chatRoomConnection.invoke("GetConnectedUsers");
    if (getresult && getresult.length > 0) {
      store.dispatch("refreshChatlist", getresult);
    } else {
      Log(`取得使用者資訊失敗`, 4);
      console.error("取得使用者資訊失敗：");
    }
  } catch (err) {
    Log(`呼叫發生錯誤：:${err}`, 4);
    console.error("呼叫發生錯誤：", err);
  }
}
//talkid:對方的userid
//senduser:本句話發話人的userid
//message:本句話的內容
export async function AddTalkDo(
  talkid?: string,
  senduserid?: string,
  message?: string
) {
  if (!talkid || !senduserid || !message) {
    return;
  }
  const currenttalkinfo: SingleTalkInfo = {
    talkid: talkid,
    sayid: senduserid,
    message: message,
  };
  //將收到的訊息加到對話清單裡
  store.dispatch("AddTalk", currenttalkinfo);
}

//刷新當前對話內容
export async function RefreshChat() {
  await store.dispatch("RefreshChat");
}

export async function SendPrivateMessage(
  nowtalkid: string,
  sayid: string,
  message: string
): Promise<boolean> {
  let result = true;
  try {
    await chatRoomConnection.invoke("PrivateMessage", nowtalkid, message);
    await UpdatePrivateMessage(nowtalkid, sayid, message);
  } catch (err) {
    Log(`傳送錯誤：${err}`, 4);
    console.error("傳送錯誤: " + err);
    result = false;
  }

  return result;
}

async function UpdatePrivateMessage(
  talkid: string,
  sayid: string,
  message: string
) {
  const privatemessageinfo: SingleTalkInfo = {
    talkid: talkid,
    sayid: sayid,
    message: message,
  };
  await store.dispatch("PrivateMessage", privatemessageinfo);
}

export default {
  Start,
  Disconnected,
  GetConnectedUsers,
  AddTalkDo,
  RefreshChat,
  SendPrivateMessage,
};
