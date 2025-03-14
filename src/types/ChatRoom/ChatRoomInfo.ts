import {HubConnection} from "@microsoft/signalr";
import {ChatInfo} from "@/types/ChatRoom/ChatInfo";
import type { TalkInfo,TalkContentInfo,NowTalkInfo} from "@/types/ChatRoom/TalkInfo";

export class ChatRoomInfo{
    constructor(){
        this.chatlist = new Array<ChatInfo>();
        this.talklist = new Array<TalkInfo>();
    }
    connection?:HubConnection;
    chatlist?:Array<ChatInfo>;
    // nowtalkid?:string;
    nowTalkinfo?:NowTalkInfo;//存放當前聊天對象的資訊
    talklist?:Array<TalkInfo>;//聊天內容清單
    nowtalk?:Array<TalkContentInfo>; //存放當前正在聊天的完整對話內容
}

export class PrivatMessageModel{
    constructor(){
        this.Chatinfo =new ChatInfo();
        this.Message = "";
    }
    Chatinfo:ChatInfo;
    Message:string;
}

