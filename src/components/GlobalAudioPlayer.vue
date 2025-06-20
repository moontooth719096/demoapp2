<template>
  <audio
    ref="audio"
    :src="currentSong?.url || ''"
    style="display: none"
    @ended="onAudioEnded"
  />
</template>

<script lang="ts" setup>
import { ref, watch, computed, nextTick, onMounted } from "vue";
import { useMusicPlayerStore } from "@/store/MusicPlayerStore";

const musicPlayerStore = useMusicPlayerStore();
const audio = ref<HTMLAudioElement | null>(null);
const currentSong = computed(() => musicPlayerStore.currentSong);

watch(
  () => currentSong.value?.url,
  async (newUrl, oldUrl) => {
    if (audio.value && newUrl && newUrl !== oldUrl) {
      audio.value.load();
      if (musicPlayerStore.isPlaying) {
        await nextTick();
        audio.value.play();
      }
    }
  }
);

watch(
  () => musicPlayerStore.isPlaying,
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

const onAudioEnded = () => {
  if (musicPlayerStore.repeatMode == 2) {
    if (audio.value) {
      audio.value.currentTime = 0;
      audio.value.play();
    }
    return;
  }
  musicPlayerStore.nextSong();
};

onMounted(async () => {
  if (audio.value && musicPlayerStore.isPlaying && currentSong.value?.url) {
    audio.value.load();
    await nextTick();
    audio.value.play();
  }
});
</script>
