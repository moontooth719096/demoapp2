import { UserInfo } from "@/types/UserInfo";
export class GoogleLoginApiResult {
  constructor() {
    this.code = 0;
  }
  code: number;
  JWT?: string;
  UserInfo?: UserInfo;
}
