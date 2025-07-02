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
          </div>
          <div v-if="currentSong" class="audio-wrap">
            <div class="audio-title" v-if="currentSong">
              {{ currentSong.title }}
            </div>
            <div class="audio-controls-bottom">
              <div class="audio-progress">
                <span class="audio-time">{{ formatTime(progress) }}</span>
                <input
                  type="range"
                  min="0"
                  :max="duration"
                  step="0.1"
                  v-model="progress"
                  @input="onSeek"
                />
                <span class="audio-time">{{ formatTime(duration) }}</span>
              </div>
              <div class="audio-btn-group">
                <div class="left-placeholder"></div>
                <div class="main-btn-group">
                  <button
                    class="audio-btn"
                    @click="prevSong"
                    :disabled="playList.length === 0"
                  >
                    <i class="bi bi-skip-start-fill"></i>
                  </button>
                  <button
                    class="audio-btn"
                    @click="play"
                    v-if="!musicPlayerStore.isPlaying"
                    :disabled="playList.length === 0"
                  >
                    <i class="bi bi-play-fill"></i>
                  </button>
                  <button
                    class="audio-btn"
                    @click="pause"
                    v-else
                    :disabled="playList.length === 0"
                  >
                    <i class="bi bi-pause-fill"></i>
                  </button>
                  <button
                    class="audio-btn"
                    @click="nextSong"
                    :disabled="playList.length === 0"
                  >
                    <i class="bi bi-skip-end-fill"></i>
                  </button>
                </div>
                <div class="sub-btn-group">
                  <i
                    v-if="musicPlayerStore.repeatMode == 1"
                    class="bi bi-repeat"
                    @click="changeRepeatMode(2)"
                  ></i>
                  <i
                    v-else
                    class="bi bi-repeat-1"
                    @click="changeRepeatMode(1)"
                  ></i>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, watch } from "vue";
import { useMusicPlayerStore } from "@/store/MusicPlayerStore";
import { useMusicPlayerFunctions } from "@/utils/useMusicPlayerFunctions";
type Ref<T> = import("vue").Ref<T>;

interface PlayItem {
  name: string;
  url: string;
}

const markedDeleteSongs = ref<Set<string>>(new Set());
const markedStarSongs = ref<Set<string>>(new Set());
const musicPlayerStore = useMusicPlayerStore();
// 將 playList, currentIndex 直接與 store 綁定
const playList = computed(() =>
  musicPlayerStore.songs.map((item) => ({ name: item.title, url: item.url }))
);
const currentSong = computed(() => musicPlayerStore.currentSong);
const currentIndex = computed({
  get: () => musicPlayerStore.currentIndex,
  set: (val: number) => musicPlayerStore.setSong(val),
});
const albumImgUrl: Ref<string> = ref("");
const duration = ref(0);
const progress = ref(0);

// 監聽 audio 播放進度
const updateProgress = () => {
  const audio = musicPlayerStore.audio;
  if (audio) {
    progress.value = audio.currentTime;
    duration.value = audio.duration || 0;
  }
};

const onSeek = () => {
  const audio = musicPlayerStore.audio;
  if (audio) {
    audio.currentTime = progress.value;
  }
};

const formatTime = (sec: number) => {
  if (!isFinite(sec)) return "00:00";
  const m = Math.floor(sec / 60)
    .toString()
    .padStart(2, "0");
  const s = Math.floor(sec % 60)
    .toString()
    .padStart(2, "0");
  return `${m}:${s}`;
};

// 監聽 audio 事件
watch(
  () => musicPlayerStore.currentSong?.url,
  () => {
    const audio = musicPlayerStore.audio;
    if (audio) {
      audio.ontimeupdate = updateProgress;
      audio.onloadedmetadata = updateProgress;
    }
  },
  { immediate: true }
);

// 監聽 store 的 isPlaying 狀態，自動控制 audio 播放/暫停
watch(
  () => musicPlayerStore.isPlaying,
  (val) => {
    const audio = musicPlayerStore.audio;
    if (audio) {
      if (val) {
        audio.play();
      } else {
        audio.pause();
      }
    }
  }
);
const play = () => musicPlayerStore.play();
const pause = () => musicPlayerStore.pause();
const prevSong = () => musicPlayerStore.prevSong();
const nextSong = () => musicPlayerStore.nextSong();
const changeRepeatMode = (mode: 1 | 2) => musicPlayerStore.setRepeatMode(mode);

function onFileChange(event: Event) {
  musicPlayerStore.clearObjectUrl();
  clearmarkedDeleteSongs();
  const input = event.target as HTMLInputElement;
  const files = input.files;
  if (files && files.length > 0) {
    // 將歌曲清單同步到 Pinia store
    musicPlayerStore.setSongs(
      Array.from(files).map((file: File) => ({
        title: file.name,
        url: URL.createObjectURL(file),
        imgUrl: "", // 預設無圖
      })),
      0
    );
    // 預設播放第一首
    currentIndex.value = 0;
    setCurrentAudio(currentIndex.value);
  }
}

function setCurrentAudio(idx: number) {
  if (playList.value[idx]) {
    musicPlayerStore.setSong(idx);
    // 嘗試取得專輯封面（僅支援部分 mp3，瀏覽器原生 File API 無法直接取得，這裡預設無圖）
    albumImgUrl.value = "";
    // 自動播放
    // setTimeout(() => {
    //   const audio = document.querySelector(
    //     ".audio-wrap audio"
    //   ) as HTMLAudioElement | null;
    //   if (audio) audio.play();
    // }, 100);
  }
}

function playFromList(idx: number) {
  setCurrentAudio(idx);
}

function onAudioEnded() {
  nextSong();
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
</script>

<style lang="scss" scoped>
@import "@/assets/styles/MusicPlayer/MusicPlayer.scss";
</style>
