<template>
  <div
    :class="['mini-music-player', { inactive: !visible }]"
    :style="blockStyle"
    ref="miniPlayerRef"
    @mousedown="onMouseDown"
  >
    <div class="song-info">
      <span class="song-title" v-if="currentSong">{{ currentSong.title }}</span>
      <span class="song-title" v-else>無歌曲</span>
    </div>
    <div class="progress-bar" v-if="currentSong && duration > 0">
      <span class="time">{{ formatTime(currentTime) }}</span>
      <input
        type="range"
        min="0"
        :max="duration"
        step="0.1"
        v-model.number="currentTime"
        @input="onSeek"
      />
      <span class="time">{{ formatTime(duration) }}</span>
    </div>
    <div class="controls">
      <button @click="prevSong" title="上一首">⏮️</button>
      <button v-if="!isPlaying" @click="play" title="播放">▶️</button>
      <button v-else @click="pause" title="暫停">⏸️</button>
      <button @click="nextSong" title="下一首">⏭️</button>
    </div>
  </div>
</template>

<script lang="ts">
import {
  defineComponent,
  ref,
  computed,
  watch,
  nextTick,
  onMounted,
} from "vue";
import { useMusicPlayerStore } from "@/store/MusicPlayerStore";
import { useDraggable } from "@/utils/useDraggable";

export default defineComponent({
  name: "MiniMusicPlayer",
  setup() {
    const musicPlayerStore = useMusicPlayerStore();
    // 取得全域 audio 實例
    const getGlobalAudio = () =>
      (window as any).audio as HTMLAudioElement | null;
    const currentSong = computed(() => musicPlayerStore.currentSong);
    const isPlaying = computed({
      get: () => musicPlayerStore.isPlaying,
      set: (val: boolean) =>
        val ? musicPlayerStore.play() : musicPlayerStore.pause(),
    });
    // 進度條相關
    const currentTime = ref(0);
    const duration = ref(0);
    // 直接用 Pinia store 的 audio
    const audio = computed(() => musicPlayerStore.audio);
    // 進度條同步
    const updateProgress = () => {
      if (audio.value) {
        currentTime.value = audio.value.currentTime;
        duration.value = audio.value.duration || 0;
      }
    };
    const onSeek = () => {
      if (audio.value) {
        audio.value.currentTime = currentTime.value;
      }
    };
    const formatTime = (sec: number) => {
      const m = Math.floor(sec / 60)
        .toString()
        .padStart(2, "0");
      const s = Math.floor(sec % 60)
        .toString()
        .padStart(2, "0");
      return `${m}:${s}`;
    };
    // 監聽 audio 實體
    watch(
      () => musicPlayerStore.currentSong?.url,
      () => {
        updateProgress();
        if (audio.value) {
          audio.value.ontimeupdate = updateProgress;
          audio.value.onloadedmetadata = updateProgress;
        }
      },
      { immediate: true }
    );
    // 監聽 isPlaying 狀態自動播放/暫停
    watch(
      () => isPlaying.value,
      (val) => {
        if (audio.value) {
          if (val) {
            audio.value.play();
          } else {
            audio.value.pause();
          }
        }
      }
    );
    // 初始化進度條
    onMounted(() => {
      updateProgress();
    });
    const play = () => musicPlayerStore.play();
    const pause = () => musicPlayerStore.pause();
    const prevSong = () => musicPlayerStore.prevSong();
    const nextSong = () => musicPlayerStore.nextSong();
    const miniPlayerRef = ref<HTMLElement | null>(null);
    const { blockStyle, onMouseDown } = useDraggable(
      miniPlayerRef,
      50,
      50,
      1200
    );
    // 透明度控制
    const visible = ref(true);
    const isHovering = ref(false);
    let hideTimer: ReturnType<typeof setTimeout> | null = null;
    const setVisible = (val: boolean) => {
      visible.value = val;
    };
    const resetHideTimer = () => {
      setVisible(true);
      if (hideTimer) clearTimeout(hideTimer);
      hideTimer = setTimeout(() => {
        if (!isHovering.value) setVisible(false);
      }, 700);
    };
    onMounted(() => {
      if (miniPlayerRef.value) {
        miniPlayerRef.value.addEventListener("mouseenter", () => {
          isHovering.value = true;
          setVisible(true);
          if (hideTimer) clearTimeout(hideTimer);
        });
        miniPlayerRef.value.addEventListener("mousemove", resetHideTimer);
        miniPlayerRef.value.addEventListener("mouseleave", () => {
          isHovering.value = false;
          resetHideTimer();
        });
      }
      resetHideTimer();
    });
    return {
      currentSong,
      isPlaying,
      play,
      pause,
      prevSong,
      nextSong,
      currentTime,
      duration,
      onSeek,
      formatTime,
      miniPlayerRef,
      blockStyle,
      onMouseDown,
      visible,
    };
  },
});
</script>

<style lang="scss" scoped>
.mini-music-player {
  display: flex;
  flex-direction: column;
  align-items: stretch;
  background: #222;
  color: #fff;
  border-radius: 8px;
  padding: 5px 18px 0px 18px;
  // width: calc(630px * var(--mini-player-scale, 1));
  // height: calc(83px * var(--mini-player-scale, 1));
  width: 630px;
  height: 83px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.15);
  transition: opacity 0.4s, transform 0.2s, width 0.2s, height 0.2s;
  opacity: 1;
}

.mini-music-player.inactive {
  opacity: 0;
  pointer-events: auto;
}
.song-info {
  font-size: 1.08rem;
  font-weight: 500;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
  text-align: center;
  margin-bottom: 2px;
}
.controls {
  display: flex;
  justify-content: center;
  gap: 12px;
  margin-bottom: 2px;

  button {
    background: none;
    border: none;
    color: #fff;
    font-size: 1.3rem;
    cursor: pointer;
    transition: color 0.2s;
    padding: 2px 8px;
    border-radius: 4px;

    &:hover {
      color: #1db954;
      background: #333;
    }
  }
}

.progress-bar {
  display: flex;
  align-items: center;
  flex-direction: row;

  input[type="range"] {
    flex: 1;
    accent-color: #1db954;
    height: 4px;
  }
}
.time {
  font-size: 0.92rem;
  min-width: 48px;
  text-align: center;
  color: #bbb;
}
</style>
