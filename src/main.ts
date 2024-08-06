import "./assets/main.css";
import { createApp } from "vue";
import App from "./App.vue";
import router from "@/router";
import store from './store'
import GoogleSignInPlugin from "vue3-google-signin"
// import vue3GoogleLogin from 'vue3-google-login'
import "bootstrap/dist/css/bootstrap.min.css";
import "bootstrap";

createApp(App)
.use(GoogleSignInPlugin, {
    clientId: '464709150983-inueb5o7stba381k8p47ai0grhd8glvl.apps.googleusercontent.com',
  })
  // .use(vue3GoogleLogin, {
  //   clientId: '464709150983-inueb5o7stba381k8p47ai0grhd8glvl.apps.googleusercontent.com'
  // })
.use(store)
.use(router)
.mount("#app");
