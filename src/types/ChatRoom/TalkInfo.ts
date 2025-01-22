//本句話訊息
export interface TalkContentInfo{
    sayid?:string;//本句話發話的userid
    message?:string;//發話內容
}
//對某個人的聊天室資料
export class TalkInfo{
    constructor(){
        this.talkid = "",
        this.talkImgPath="";
        this.talks = new Array<TalkContentInfo>()
    }
    talkid:string;//對方的userid
    talkImgPath:string;
    talks:Array<TalkContentInfo>;//聊天內容
}

export interface SingleTalkInfo extends TalkContentInfo{
    talkid?:string;//對方的userid
}

export interface NowTalkInfo{
    UserID:string;
    PicturesPath:string;
}
