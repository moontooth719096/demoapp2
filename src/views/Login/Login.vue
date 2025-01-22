<template>
  <div id="LoginPage">
    <div id="CardPannel" class="card">
      <div class="card-body">
        <form>
          <div class="mb-3">
            <label for="exampleInputEmail1" class="form-label"
              >Email address</label
            >
            <input
              type="email"
              class="form-control"
              id="exampleInputEmail1"
              aria-describedby="emailHelp"
            />
            <div id="emailHelp" class="form-text">
              We'll never share your email with anyone else.
            </div>
          </div>
          <div class="mb-3">
            <label for="exampleInputPassword1" class="form-label"
              >Password</label
            >
            <input
              type="password"
              class="form-control"
              id="exampleInputPassword1"
            />
          </div>
          <div class="mb-3 form-check">
            <input
              type="checkbox"
              class="form-check-input"
              id="exampleCheck1"
            />
            <label class="form-check-label" for="exampleCheck1"
              >Check me out</label
            >
          </div>
          <div class="row">
            <button type="button" class="btn btn-primary col m-1">
              Submit
            </button>

            <!-- <div id="buttonDiv" class="col m-1"></div> -->
            <GoogleSignInButton
              @success="handleLoginSuccess"
              @error="handleLoginError"
              :one-tap="true"
              :shape="'rectangular'"
              :theme="'filled_black'"
              :size="'medium'"
              :text="'signin'"
              :logo_alignment="'left'"
            ></GoogleSignInButton>
            <!-- <GoogleLogin :callback="callback"/> -->
          </div>
        </form>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
//https://vue3-google-signin.vercel.app/guide/google-signin-button.html
import { computed } from "vue";
import {
  type CredentialResponse,
  useOneTap,
  decodeCredential,
} from "vue3-google-signin";
import { axiosBase, RespType } from "@/utils/ApiHelper";
import { setTokenCookie } from "@/utils/cookie";
import { LoginCheck } from "@/utils/Auth";
import { GoogleLoginApiResult } from "@/types/GoogleLogin";
import store from "@/store";
import Swal from "sweetalert2";

const userInfo = computed(() => store.getters.userInfo);

useOneTap({
  onSuccess: (response: CredentialResponse) => {
    console.log("Success:", response);
    handleLoginSuccess(response);
  },
  onError: () => {
    console.error("Error with One Tap Login");
    handleLoginError();
  },
});
// handle success event
const handleLoginSuccess = async (response: CredentialResponse) => {
  const { credential } = response;

  let getresult = await googleLogin(credential);
  if (getresult.code != 1) {
    return;
  }
  const responsePayload = decodeJwtResponse(getresult.JWT);
  //token寫入Cookie
  setTokenCookie(getresult.JWT, responsePayload.exp * 1000);
  //再回去檢查一次token
  await LoginCheck();
  console.log("Access Token", credential);
};

// handle an error event
const handleLoginError = () => {
  console.error("Login failed");
};

const googleLogin = async (
  token: string | undefined
): Promise<GoogleLoginApiResult> => {
  let result = new GoogleLoginApiResult();
  const postdata = {
    credential: token,
  };
  const apiHelp = axiosBase();
  await apiHelp
    .post(import.meta.env.VITE_GoogleLoginUri, postdata)
    .then(function (response) {
      if (response === null || response === undefined) {
        Swal.fire({
          icon: "error",
          text: "登入失敗",
        });
        return;
      }
      result.code = 1;
      result.JWT = response.data.JWT;
      if (userInfo) store.commit("setUserInfo", response.data.userInfo);
    })
    .catch(function (error) {
      //判斷沒有跳出錯誤訊息
      Swal.fire({
        icon: "error",
        text: "登入失敗",
      });
      console.error(error);
    });
  return result;
};

const decodeJwtResponse = (token: string | undefined): any => {
  if (token === undefined) return "";
  var base64Url = token.split(".")[1];
  var base64 = base64Url.replace(/-/g, "+").replace(/_/g, "/");
  var jsonPayload = decodeURIComponent(
    atob(base64)
      .split("")
      .map(function (c) {
        return "%" + ("00" + c.charCodeAt(0).toString(16)).slice(-2);
      })
      .join("")
  );

  return JSON.parse(jsonPayload);
};
</script>

<style lang="scss" scoped>
@import "@/assets/styles/LoginPage/login.scss";
</style>
