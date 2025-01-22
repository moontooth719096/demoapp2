import {UserInfo} from "@/types/UserInfo";

export class ChatInfo extends UserInfo {
  constructor(){
    super();
    this.NoReadCount = 0;
  }
  ConnectionID?: string;
  NoReadCount: number;
  LastMesage?:string;
}