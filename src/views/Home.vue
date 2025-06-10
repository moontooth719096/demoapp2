<template>
  <div class="home-page">
    <div class="home-header">
      <h1>🎉 DemoProgressBar</h1>
    </div>
    <div class="home-features">
      <div class="feature-card">
        <router-link to="/ChatRoom">
          <div class="icon">💬</div>
          <div class="title">聊天室</div>
          <div class="desc">即時多人訊息互動，支援推播與訊息去重。</div>
        </router-link>
      </div>
      <div class="feature-card">
        <router-link to="/YoutubeDownload">
          <div class="icon">📥</div>
          <div class="title">YouTube 下載</div>
          <div class="desc">支援影片/播放清單下載，Google Drive 雲端儲存。</div>
        </router-link>
      </div>
      <div class="feature-card">
        <router-link to="/BakingConversionCalculator">
          <div class="icon">🍰</div>
          <div class="title">食譜尺寸換算</div>
          <div class="desc">一鍵換算烘焙模具與材料，支援多種單位。</div>
        </router-link>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
// 首頁不需邏輯
</script>

<style lang="scss" scoped>
@import "@/assets/styles/size.scss";
.home-page {
  min-height: 100vh;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: flex-start;
  background: linear-gradient(135deg, #e3f0ff 0%, #f9f9f9 100%);
  padding: 2.5rem 1rem 1.5rem 1rem;
}
.home-header {
  text-align: center;
  margin-bottom: 2.5rem;
  h1 {
    font-size: 2.2rem;
    color: #1976d2;
    margin-bottom: 0.7rem;
  }
}
.home-features {
  display: flex;
  gap: 2rem;
  flex-wrap: wrap;
  justify-content: center;
  margin-bottom: 2.5rem;
}
.feature-card {
  background: #fff;
  border-radius: 1.2rem;
  box-shadow: 0 2px 12px rgba(25, 118, 210, 0.08);
  padding: 2rem 1.5rem 1.2rem 1.5rem;
  min-width: 220px;
  max-width: 270px;
  text-align: center;
  transition: box-shadow 0.2s, transform 0.2s;
  cursor: pointer;
  &:hover {
    box-shadow: 0 6px 24px rgba(25, 118, 210, 0.13);
    transform: translateY(-4px) scale(1.03);
  }
  .icon {
    font-size: 2.5rem;
    margin-bottom: 0.7rem;
  }
  .title {
    font-size: 1.18rem;
    font-weight: 600;
    color: #1976d2;
    margin-bottom: 0.3rem;
  }
  .desc {
    color: #666;
    font-size: 1rem;
  }
  a {
    text-decoration: none;
    color: inherit;
    display: block;
  }
}
// 響應式設計
@include respond-to(xs) {
  .home-header h1 {
    font-size: 1.3rem;
  }
  .home-features {
    flex-direction: column;
    gap: 1.2rem;
    align-items: center;
  }
  .feature-card {
    min-width: 0;
    width: 98vw;
    max-width: 100%;
    padding: 1.2rem 0.7rem 1rem 0.7rem;
  }
}
@include respond-to(sm) {
  .home-header h1 {
    font-size: 1.6rem;
  }
  .feature-card {
    min-width: 180px;
    max-width: 98vw;
    padding: 1.5rem 1rem 1rem 1rem;
  }
}
</style>
