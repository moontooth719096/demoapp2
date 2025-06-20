<template>
  <div class="mini-music-player">
    <div class="song-info">
      <span class="song-title" v-if="currentSong">{{ currentSong.title }}</span>
      <span class="song-title" v-else>無歌曲</span>
    </div>
    <div class="controls">
      <button @click="prevSong" title="上一首">⏮️</button>
      <button v-if="!isPlaying" @click="play" title="播放">▶️</button>
      <button v-else @click="pause" title="暫停">⏸️</button>
      <button @click="nextSong" title="下一首">⏭️</button>
    </div>
    <audio
      v-if="false"
      ref="audio"
      :src="currentSong?.url || ''"
      @ended="nextSong"
      style="display: none"
    />
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

export default defineComponent({
  name: "MiniMusicPlayer",
  setup() {
    const musicPlayerStore = useMusicPlayerStore();
    const audio = ref<HTMLAudioElement | null>(null);
    const currentSong = computed(() => musicPlayerStore.currentSong);
    const isPlaying = computed({
      get: () => musicPlayerStore.isPlaying,
      set: (val: boolean) =>
        val ? musicPlayerStore.play() : musicPlayerStore.pause(),
    });

    // 監聽 currentSong.url 變化時自動 reload 並根據 isPlaying 狀態決定是否播放
    watch(
      () => currentSong.value?.url,
      async (newUrl, oldUrl) => {
        if (audio.value && newUrl && newUrl !== oldUrl) {
          audio.value.load();
          if (isPlaying.value) {
            await nextTick();
            audio.value.play();
          }
        }
      }
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

    onMounted(async () => {
      // 如果進入頁面時 isPlaying 為 true，且有歌曲，則自動播放
      if (audio.value && isPlaying.value && currentSong.value?.url) {
        audio.value.load();
        await nextTick();
        audio.value.play();
      }
    });

    const play = () => musicPlayerStore.play();
    const pause = () => musicPlayerStore.pause();
    const prevSong = () => musicPlayerStore.prevSong();
    const nextSong = () => musicPlayerStore.nextSong();

    return {
      currentSong,
      isPlaying,
      play,
      pause,
      prevSong,
      nextSong,
      audio,
    };
  },
});
</script>

<style scoped>
.mini-music-player {
  display: flex;
  align-items: center;
  background: #222;
  color: #fff;
  border-radius: 8px;
  padding: 8px 16px;
  width: 320px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.15);
}
.song-info {
  flex: 1;
  font-size: 1rem;
  font-weight: 500;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}
.controls {
  display: flex;
  gap: 8px;
}
button {
  background: none;
  border: none;
  color: #fff;
  font-size: 1.2rem;
  cursor: pointer;
  transition: color 0.2s;
}
button:hover {
  color: #1db954;
}
</style>
