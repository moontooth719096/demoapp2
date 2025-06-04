import "@/assets/styles/main.scss";
import { createApp } from "vue";
import App from "@/App.vue";
import router from "@/router";
import store from "@/store";
import GoogleSignInPlugin from "vue3-google-signin";
import "bootstrap/dist/css/bootstrap.min.css";
import "bootstrap";
import "bootstrap-icons/font/bootstrap-icons.css";
import VueGoodTableNext from "vue-good-table-next";
import "./assets/styles/dark-mode.scss";

// import the styles
import "vue-good-table-next/dist/vue-good-table-next.css";

const app = createApp(App);

app
  .use(GoogleSignInPlugin, {
    clientId: import.meta.env.VITE_GoogleClientId,
  })
  .use(store)
  .use(router)
  .use(VueGoodTableNext)
  .mount("#app");
