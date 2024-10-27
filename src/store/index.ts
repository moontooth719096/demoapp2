import { createStore } from "vuex"; // 引入 Vuex 的 createStore 方法
import { UserInfo } from "@/types/UserInfo";

// 使用 createStore 方法創建一個新的 Vuex store
export default createStore({
  // state: 定義應用程序的狀態
  state: {
    isLoading: false, // 這是一個布爾值，表示是否顯示 Loading 區塊
    userInfo: null,
  },
  // mutations: 定義改變狀態的同步方法
  mutations: {
    // setLoading: 修改 isLoading 狀態
    setLoading(state, payload) {
      state.isLoading = payload;
    },
    setUserInfo(state, payload) {
      state.userInfo = payload;
    },
  },
  // actions: 定義觸發 mutation 的方法，可以是同步或異步
  actions: {
    // showLoading: 觸發 setLoading mutation 並將 isLoading 設為 true
    showLoading({ commit }) {
      commit("setLoading", true);
    },
    // hideLoading: 觸發 setLoading mutation 並將 isLoading 設為 false
    hideLoading({ commit }) {
      commit("setLoading", false);
    },
    clearUserInfo({ commit }) {
      commit("setUserInfo", null);
    },
  },
  // getters: 定義獲取狀態的方法（類似於計算屬性）
  getters: {
    // isLoading: 返回 isLoading 狀態
    isLoading: (state) => state.isLoading,
    userInfo: (state) => state.userInfo,
  },
});
