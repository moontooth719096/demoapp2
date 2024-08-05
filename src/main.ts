import "./assets/main.css";

import { createApp } from "vue";
import App from "./App.vue";
import router from "@/router";
import LoadingCustom from "@/components/Loding/Loding.vue";
import Nav from "@/components/Nav/Nav.vue";
import store from './store'

import "bootstrap/dist/css/bootstrap.min.css";
import "bootstrap";

createApp(App).use(store).component("loding", LoadingCustom).component("nav-component", Nav).use(router).mount("#app");
