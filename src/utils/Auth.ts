import { axiosBase, RespType } from "@/utils/ApiHelper";
import { getTokenCookieBearer, deleteCookie, removeTokenCookie, cookiekey } from "@/utils/cookie";
import { PathKeyType } from "@/router/index";
import router from "@/router";

var userinfo;
export async function LoginCheck() {
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
        result = true;
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
  userinfo = null;
  deleteCookie(cookiekey.userinfo);
  removeTokenCookie();
};
