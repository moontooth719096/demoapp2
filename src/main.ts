import "@/assets/styles/main.scss";
import { createApp } from "vue";
import App from "@/App.vue";
import router from "@/router";
import store from '@/store'
import GoogleSignInPlugin from "vue3-google-signin"
import "bootstrap/dist/css/bootstrap.min.css";
import "bootstrap";

createApp(App)
.use(GoogleSignInPlugin, {
    clientId: '607977203990-5s5ur3sgv55i7gr4h8eapuuq8jvh0pim.apps.googleusercontent.com',
  })
.use(store)
.use(router)
.mount("#app");
