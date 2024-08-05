<template>
  <div class="ctn">
    <div class="circle"></div>
    <div class="small-circle"></div>
    <div class="trapezoid"></div>
  </div>
</template>
<script setup lang="ts"></script>
<style lang="scss" scoped>
@charset "UTF-8";
@keyframes rotate {
  0% {
    transform: rotate(0deg);
    opacity: 0; /* 設定透明度為 0% */
  }
  25% {
    transform: rotate(180deg); /* 旋轉到一半時的狀態 */
    border-color: rgb(52, 152, 219);
    border-top-color: transparent;
    opacity: 1; /* 設定透明度為 50% */
  }
  40% {
    opacity: 0; /* 設定透明度為 50% */
  }
  45% {
    transform: rotate(180deg); /* 旋轉到一半時的狀態 */
    border-color: rgb(255, 0, 0);
    border-top-color: transparent;
    opacity: 1; /* 設定透明度為 50% */
  }
  60% {
    opacity: 0; /* 設定透明度為 50% */
  }
  85% {
    transform: rotate(180deg); /* 旋轉到一半時的狀態 */
    border-color: rgb(52, 152, 219);
    border-top-color: transparent;
    opacity: 1; /* 設定透明度為 50% */
  }
  100% {
    transform: rotate(0deg);
    opacity: 0; /* 設定透明度為 0% */
  }
}
@keyframes show {
  0% {
    top: 100%; /* 調整小圓形的位置 */
    opacity: 0; /* 設定透明度為 0% */
  }
  40% {
    top: 50%; /* 調整小圓形的位置 */
    border-bottom: 120px solid rgb(52, 152, 219); /* 底边 */
    border-left: 50px solid transparent; /* 左斜边 */
    border-right: 50px solid transparent; /* 右斜边 */
    border-radius: 70%;
    opacity: 1; /* 設定透明度為 50% */
  }
  45% {
    opacity: 0; /* 設定透明度為 50% */
  }
  50% {
    top: 50%; /* 調整小圓形的位置 */
    border-bottom: 120px solid rgb(255, 0, 0); /* 底边 */
    border-left: 50px solid transparent; /* 左斜边 */
    border-right: 50px solid transparent; /* 右斜边 */
    border-radius: 70%;
    opacity: 1; /* 設定透明度為 50% */
  }
  55% {
    opacity: 0; /* 設定透明度為 50% */
  }
  85% {
    top: 50%; /* 調整小圓形的位置 */
    border-bottom: 120px solid rgb(52, 152, 219); /* 底边 */
    border-left: 50px solid transparent; /* 左斜边 */
    border-right: 50px solid transparent; /* 右斜边 */
    border-radius: 70%;
    opacity: 1; /* 設定透明度為 50% */
  }
  100% {
    top: 100%; /* 調整小圓形的位置 */
    opacity: 0; /* 設定透明度為 0% */
  }
}
.ctn {
  position: absolute;
  width: 15rem;
  height: 15rem;
}

.circle {
  position: absolute;
  width: 100%;
  height: 100%;
  border: 10px solid rgb(52, 152, 219);
  border-top-color: transparent;
  border-radius: 50%;
  animation: rotate 4s ease; /* 1 表示只重複一次 */
  animation-iteration-count: infinite;
  animation-delay: 0.2s; /* 延遲2秒開始動畫 */
  /*animation-fill-mode: both;*/
}

.small-circle {
  position: absolute;
  width: 60%; /* 調整小圓形的大小 */
  height: 60%; /* 調整小圓形的大小 */
  margin: 20%;
  border: 5px solid rgba(52, 152, 219, 0.7);
  border-top-color: transparent;
  border-radius: 50%;
  animation: rotate 4s ease; /* 1 表示只重複一次 */
  animation-iteration-count: infinite;
  /*animation-fill-mode: both;*/
}

.trapezoid {
  position: absolute;
  left: 4.5rem;
  width: 0.6rem; /* 底部宽度 */
  border-bottom: 120px solid rgb(52, 152, 219); /* 底边 */
  border-left: 50px solid transparent; /* 左斜边 */
  border-right: 50px solid transparent; /* 右斜边 */
  border-radius: 70%;
  animation: show 4s ease; /* 1 表示只重複一次 */
  /*animation-delay: 0.5s;*/
  animation-iteration-count: infinite;
  /*animation-fill-mode: both;*/
}
</style>
