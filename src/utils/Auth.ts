import { computed } from "vue";
import { axiosBase, RespType } from "@/utils/ApiHelper";
import { getTokenCookieBearer, deleteCookie, removeTokenCookie, cookiekey } from "@/utils/cookie";
import { PathKeyType } from "@/router/index";
import router from "@/router";
import { mapGetters } from "vuex";
import store from "@/store";
import { UserInfo } from "@/types/UserInfo";
import { Start ,Disconnected} from "./ChatRoomHubHelper";

const userInfo = computed(() => store.getters.userInfo);

export async function LoginCheck() {
  console.log("LoginCheck!");
  let checkresult = await AppLoginCheck();
  const isLoginPage = router.currentRoute.value.path === "/Login" || router.currentRoute.value.name === "Login";
  if (checkresult) {
    if (isLoginPage) {
      //如果token合法 但是當前在登入頁時導向首頁
      // window.location.replace(PageUri.HomePage);
      router.push(PathKeyType.Home.toString());
    }
  } else if (!isLoginPage) {
    //如果token不合法，且現在不在登入頁則跳至登入頁
    router.push(PathKeyType.Login.toString());
  }
}

export const AppLoginCheck = async (): Promise<boolean> => {
  var userCookie = getTokenCookieBearer();
  let result = false;
  if (userCookie) {
    //驗證token是否過期
    let apihelper = axiosBase();
    await apihelper
      .get(import.meta.env.VITE_API_LOGINCHECK)
      .then((response) => {
        if (response.status !== 200) {
          result = false;
          return;
        }
        result = true;
        if (userInfo.value){
          // const userinfo = new UserInfo();
          // userinfo.UserID =response.data.userID; 
          // userinfo.PicturesPath =response.data.picturesPath; 
          // userinfo.UserLevel =response.data.userLevel; 
          // userinfo.UserName =response.data.userName; 
          Start();//聊天室連線
          store.commit("setUserInfo", response.data);
        } 
      })
      .catch((error) => {
        console.error(error);
      });
  } else {
    console.log("NoAppToken");
  }
  return result;
};

export const AppLogOut = () => {
  Disconnected();
  AppLogOutClear();
  const isLiginPage = router.currentRoute.value.path === "/Login" || router.currentRoute.value.name === "Login";
  //如果登出時當下不在登入頁，則轉向登入頁
  if (!isLiginPage) {
    router.push(PathKeyType.Login.toString());
  }
};

const AppLogOutClear = () => {
  //deleteCookie("token");
  //deleteCookie("username");
  //deleteCookie("email");
  //deleteCookie("userInfo");
  // store.dispatch("showLoading");
  store.dispatch("LogOut");
  deleteCookie(cookiekey.userinfo);
  removeTokenCookie();
};  
