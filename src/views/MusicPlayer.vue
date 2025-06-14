<template>
  <div class="music-player-page">
    <div class="music-player-layout">
      <div class="playlist-panel">
        <div class="playlist-title">播放清單</div>
        <ul class="playlist-list">
          <li
            v-for="(item, idx) in playList"
            :key="item.url"
            :class="{ active: idx === currentIndex }"
            @click="playFromList(idx)"
          >
            <span class="music-icon">🎵</span>
            <span class="music-name">{{ item.name }}</span>
            <span v-if="idx === currentIndex" class="now-playing">▶</span>
          </li>
        </ul>
        <label class="file-label">
          <input
            type="file"
            @change="onFileChange"
            accept="audio/*"
            class="file-input"
            webkitdirectory
            directory
          />
          <span class="file-btn"><i class="bi bi-folder-plus"></i></span>
        </label>
      </div>
      <div class="player-panel">
        <div class="music-player-card">
          <div class="audio-img">
            <img v-if="albumImgUrl" :src="albumImgUrl" alt="album cover" />
            <div v-else class="audio-img-placeholder">🎵</div>
          </div>
          <div class="audio-controls">
            <button
              class="audio-btn"
              @click="prevTrack"
              :disabled="playList.length === 0"
            >
              <i class="bi bi-skip-backward-fill"></i>
            </button>
            <!-- 垃圾桶標記/取消 -->
            <button
              v-if="markedStarSongs.size === 0"
              class="audio-btn"
              @click="toggleMarkCurrentSong"
              :disabled="playList.length === 0"
              :style="isCurrentSongMarked() ? 'background:red;color:#fff;' : ''"
            >
              <span v-if="isCurrentSongMarked()"
                ><i class="bi bi-trash-fill"></i
              ></span>
              <span v-else><i class="bi bi-trash"></i></span>
            </button>
            <!-- 刪除標記刷新 -->
            <button
              v-if="markedDeleteSongs.size > 0"
              class="audio-btn"
              @click="clearmarkedDeleteSongs"
              title="清空所有刪除標記"
            >
              <i class="bi bi-arrow-clockwise"></i>
            </button>
            <!-- 星星標記/取消 -->
            <button
              v-if="markedDeleteSongs.size === 0"
              class="audio-btn"
              @click="toggleStarMarkCurrentSong"
              :disabled="playList.length === 0"
              :style="
                isCurrentSongStarMarked() ? 'background:gold;color:#fff;' : ''
              "
            >
              <span v-if="isCurrentSongStarMarked()"
                ><i class="bi bi-star-fill"></i
              ></span>
              <span v-else><i class="bi bi-star"></i></span>
            </button>
            <!-- 星星標記刷新 -->
            <button
              v-if="markedStarSongs.size > 0"
              class="audio-btn"
              @click="clearmarkedStarDeleteSongs"
              title="清空所有星星標記"
            >
              <i class="bi bi-arrow-clockwise"></i>
            </button>
            <!-- 匯出未被垃圾桶標記的歌曲 -->
            <button
              v-if="markedDeleteSongs.size > 0"
              class="audio-btn"
              @click="saveUnmarkedSongsToFolder(1)"
              :disabled="playList.length === 0"
              title="匯出未被垃圾桶標記的歌曲"
            >
              <i class="bi bi-file-earmark-arrow-down-fill"></i>
            </button>
            <!-- 匯出已被星星標記的歌曲 -->
            <button
              v-if="markedStarSongs.size > 0"
              class="audio-btn"
              @click="saveUnmarkedSongsToFolder(2)"
              :disabled="playList.length === 0"
              title="匯出已被星星標記的歌曲"
            >
              <i class="bi bi-file-earmark-arrow-down"></i>
            </button>
            <button
              class="audio-btn"
              @click="nextTrack"
              :disabled="playList.length === 0"
            >
              <i class="bi bi-skip-forward-fill"></i>
            </button>
          </div>
          <div v-if="audioUrl" class="audio-wrap">
            <div class="audio-title">{{ fileName }}</div>
            <audio :src="audioUrl" controls @ended="onAudioEnded"></audio>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onUnmounted } from "vue";
type Ref<T> = import("vue").Ref<T>;

interface PlayItem {
  name: string;
  url: string;
}

const audioUrl: Ref<string | null> = ref(null);
const fileName: Ref<string> = ref("");
const playList: Ref<PlayItem[]> = ref([]);
const currentIndex: Ref<number> = ref(-1);
const albumImgUrl: Ref<string> = ref("");
const markedDeleteSongs = ref<Set<string>>(new Set());
const markedStarSongs = ref<Set<string>>(new Set());
function onFileChange(event: Event) {
  clearObjectUrl();
  clearmarkedDeleteSongs();
  const input = event.target as HTMLInputElement;
  const files = input.files;
  if (files && files.length > 0) {
    playList.value = Array.from(files).map((file: File) => ({
      name: file.name,
      url: URL.createObjectURL(file),
    }));
    // 預設播放第一首
    currentIndex.value = 0;
    setCurrentAudio(0);
    // 自動播放
    setTimeout(() => {
      const audio = document.querySelector(
        ".audio-wrap audio"
      ) as HTMLAudioElement | null;
      if (audio) audio.play();
    }, 100);
  }
}

function setCurrentAudio(idx: number) {
  if (playList.value[idx]) {
    audioUrl.value = playList.value[idx].url;
    fileName.value = playList.value[idx].name;
    currentIndex.value = idx;
    // 嘗試取得專輯封面（僅支援部分 mp3，瀏覽器原生 File API 無法直接取得，這裡預設無圖）
    albumImgUrl.value = "";
    // 自動播放
    setTimeout(() => {
      const audio = document.querySelector(
        ".audio-wrap audio"
      ) as HTMLAudioElement | null;
      if (audio) audio.play();
    }, 100);
  }
}

function playFromList(idx: number) {
  setCurrentAudio(idx);
}

function prevTrack() {
  if (playList.value.length === 0) return;
  let prevIdx = currentIndex.value - 1;
  if (prevIdx < 0) prevIdx = playList.value.length - 1;
  setCurrentAudio(prevIdx);
}

function nextTrack() {
  if (playList.value.length === 0) return;
  let nextIdx = currentIndex.value + 1;
  if (nextIdx >= playList.value.length) nextIdx = 0;
  setCurrentAudio(nextIdx);
}

function onAudioEnded() {
  nextTrack();
}

function clearObjectUrl() {
  playList.value.forEach((item) => {
    URL.revokeObjectURL(item.url);
  });
}

function toggleMarkCurrentSong() {
  const current = playList.value[currentIndex.value];
  if (!current) return;
  if (markedDeleteSongs.value.has(current.name)) {
    markedDeleteSongs.value.delete(current.name);
  } else {
    markedDeleteSongs.value.add(current.name);
  }
}

function isCurrentSongMarked() {
  const current = playList.value[currentIndex.value];
  if (!current) return false;
  return markedDeleteSongs.value.has(current.name);
}

function clearmarkedDeleteSongs() {
  markedDeleteSongs.value.clear();
}

function toggleStarMarkCurrentSong() {
  const current = playList.value[currentIndex.value];
  if (!current) return;
  if (markedStarSongs.value.has(current.name)) {
    markedStarSongs.value.delete(current.name);
  } else {
    markedStarSongs.value.add(current.name);
  }
}

function isCurrentSongStarMarked() {
  const current = playList.value[currentIndex.value];
  if (!current) return false;
  return markedStarSongs.value.has(current.name);
}

function clearmarkedStarDeleteSongs() {
  markedStarSongs.value.clear();
}

async function saveUnmarkedSongsToFolder(downloadtype: number) {
  let markedsong: PlayItem[] = [];
  if (downloadtype == 1) {
    markedsong = playList.value.filter(
      (item) => !markedDeleteSongs.value.has(item.name)
    );
  }
  if (downloadtype == 2) {
    markedsong = playList.value.filter((item) =>
      markedStarSongs.value.has(item.name)
    );
  }

  if (markedsong.length === 0) {
    alert("沒有歌曲可匯出");
    return;
  }
  // 嘗試 File System Access API
  // @ts-ignore
  if (window.showDirectoryPicker) {
    // @ts-ignore
    const dirHandle = await window.showDirectoryPicker();
    for (const item of markedsong) {
      // 取得原始 File 物件
      const file = await fetch(item.url).then((r) => r.blob());
      const fileHandle = await dirHandle.getFileHandle(item.name, {
        create: true,
      });
      const writable = await fileHandle.createWritable();
      await writable.write(file);
      await writable.close();
    }
    if (downloadtype == 1) {
      alert("未標記歌曲已匯出到指定資料夾");
    }
    if (downloadtype == 2) {
      alert("已標記歌曲已匯出到指定資料夾");
    }
  } else {
    // fallback: 觸發多檔下載
    for (const item of markedsong) {
      const a = document.createElement("a");
      a.href = item.url;
      a.download = item.name;
      a.style.display = "none";
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
    }
  }
}

// 釋放所有 ObjectURL
onUnmounted(() => {
  clearObjectUrl();
});
</script>

<style lang="scss" scoped>
@import "@/assets/styles/size.scss";
.music-player-page {
  height: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
  background: linear-gradient(135deg, #e3f0ff 0%, #f9f9f9 100%);
  padding: 2rem 1rem;
}
.music-player-layout {
  display: flex;
  gap: 0.5rem;
  width: 80%;
  height: 100%;
  min-height: 600px;
  align-items: flex-start;
}
.playlist-panel {
  width: 260px;
  height: 100%;
  min-width: 180px;
  background: #fff;
  border-radius: 1.2rem;
  box-shadow: 0 2px 12px rgba(25, 118, 210, 0.08);
  padding: 1.5rem 1rem 1rem 1rem;
  display: flex;
  flex-direction: column;
  align-items: stretch;
  .playlist-title {
    font-weight: 600;
    color: #1976d2;
    margin-bottom: 0.5rem;
    font-size: 1.08rem;
    text-align: center;
  }
  .playlist-list {
    list-style: none;
    padding: 0;
    margin: 0 0 1.2rem 0;
    height: 90%;
    overflow-y: auto;
    border-radius: 0.5rem;
    background: #f5f7fa;
    box-shadow: 0 1px 4px rgba(25, 118, 210, 0.04);
    li {
      display: flex;
      align-items: center;
      gap: 0.3rem;
      padding: 0.1rem 0.5rem;
      cursor: pointer;
      font-size: 0.92rem;
      color: #333;
      border-bottom: 1px solid #e3eaf5;
      transition: background 0.18s, color 0.18s;
      height: 1.6em;
      min-height: 1.6em;
      max-height: 1.6em;
      line-height: 1.6em;
      overflow: hidden;
      &:last-child {
        border-bottom: none;
      }
      &.active {
        background: #e3f0ff;
        color: #1976d2;
        font-weight: 600;
      }
      .music-icon {
        font-size: 1em;
        flex-shrink: 0;
      }
      .now-playing {
        color: #43a047;
        font-size: 1em;
        margin-left: auto;
        flex-shrink: 0;
      }
      .music-name {
        flex: 1;
        white-space: nowrap;
        overflow: hidden;
        text-overflow: ellipsis;
        word-break: break-all;
      }
    }
  }
  .file-label {
    display: block;
    position: relative;
    margin-bottom: 0;
    text-align: center;
  }
  .file-input {
    display: none;
  }
  .file-btn {
    display: inline-block;
    background: #1976d2;
    color: #fff;
    font-weight: 600;
    font-size: 1.08rem;
    border-radius: 0.6rem;
    padding: 0.7rem 1.5rem;
    cursor: pointer;
    transition: background 0.2s;
    border: none;
    box-shadow: 0 1px 4px rgba(25, 118, 210, 0.08);
    &:hover {
      background: #1256a3;
    }
  }
}
.player-panel {
  flex: 1;
  display: flex;
  align-items: center;
  justify-content: center;
  width: 100%;
  height: 100%;
  .music-player-card {
    background: #fff;
    border-radius: 1.2rem;
    box-shadow: 0 2px 12px rgba(25, 118, 210, 0.08);
    padding: 2.5rem 2rem 2rem 2rem;
    min-width: 260px;
    width: 100%;
    height: 100%;
    min-height: 540px;
    text-align: center;
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: flex-start;
    .audio-img {
      // 佔據 music-player-card 的 70% 高度
      width: 70%;
      aspect-ratio: 1/1;
      height: 70%;
      min-height: 120px;
      min-width: 120px;
      margin: 0 auto 1.2rem auto;
      display: flex;
      align-items: center;
      justify-content: center;
      border-radius: 1rem;
      background: #f5f7fa;
      box-shadow: 0 1px 6px rgba(25, 118, 210, 0.07);
      overflow: hidden;
      img {
        width: 100%;
        height: 100%;
        object-fit: cover;
        border-radius: 1rem;
        display: block;
      }
      .audio-img-placeholder {
        font-size: 3.5rem;
        color: #b0c4de;
        width: 100%;
        text-align: center;
        line-height: 100%;
        user-select: none;
        min-height: 100%;
        min-width: 100%;
        display: flex;
        align-items: center;
        justify-content: center;
      }
    }
    .audio-controls {
      display: flex;
      justify-content: center;
      gap: 0.7rem; // 原本 1.2rem，縮小間距
      margin: 1.2rem 0 0.5rem 0;
      .audio-btn {
        background: #1976d2;
        color: #fff;
        border: none;
        border-radius: 0.6rem;
        font-size: 0.95rem; // 原本 1.08rem，縮小字體
        font-weight: 600;
        padding: 0.32rem 0.7rem; // 原本 0.5rem 1.2rem，縮小
        cursor: pointer;
        transition: background 0.2s;
        &:hover:enabled {
          background: #1256a3;
        }
        &:disabled {
          background: #b0c4de;
          color: #fff;
          cursor: not-allowed;
        }
      }
    }
    .audio-wrap {
      width: 100%;
      .audio-title {
        width: 100%;
        font-size: 1.02rem;
        color: #1976d2;
        margin-bottom: 0.5rem;
        display: -webkit-box;
        -webkit-line-clamp: 2;
        -webkit-box-orient: vertical;
        line-clamp: 2;
        box-orient: vertical;
        overflow: hidden;
        text-overflow: ellipsis;
        min-height: 3em;
        max-height: 3em;
        /* 移除 word-break: break-all; 以避免單字被截斷 */
      }
    }
    audio {
      width: 100%;
      outline: none;
      border-radius: 0.5rem;
      background: #f5f7fa;
    }
  }
}
// 響應式設計
@include respond-to(xs) {
  .music-player-layout {
    flex-direction: column;
    gap: 1.2rem;
    align-items: stretch;
  }
  .playlist-panel {
    width: 100%;
    min-width: 0;
    max-width: 98vw;
    padding: 1.2rem 0.5rem 1rem 0.5rem;
    .playlist-list {
      max-height: 180px;
    }
    .file-btn {
      font-size: 1em;
      padding: 0.6rem 1rem;
    }
  }
  .player-panel .music-player-card {
    min-width: 0;
    max-width: 98vw;
    padding: 1.2rem 0.5rem 1rem 0.5rem;
    h2 {
      font-size: 1.1rem;
    }
  }
}
</style>
