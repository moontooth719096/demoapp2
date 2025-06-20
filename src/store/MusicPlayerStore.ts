import { defineStore } from "pinia";
import { ref, computed } from "vue";

export interface Song {
  title: string;
  url: string;
}

export const useMusicPlayerStore = defineStore("musicPlayer", () => {
  // 歌曲清單可根據實際需求動態載入
  const songs = ref<Song[]>([]);
  const currentIndex = ref(0);
  const isPlaying = ref(false);
  const repeatMode = ref<1 | 2>(1);

  const currentSong = computed(() =>
    songs.value.length > 0 &&
    currentIndex.value >= 0 &&
    currentIndex.value < songs.value.length
      ? songs.value[currentIndex.value]
      : undefined
  );

  function play() {
    isPlaying.value = true;
  }
  function pause() {
    isPlaying.value = false;
  }
  function prevSong() {
    currentIndex.value =
      (currentIndex.value - 1 + songs.value.length) % songs.value.length;
    isPlaying.value = true;
  }
  function nextSong() {
    currentIndex.value = (currentIndex.value + 1) % songs.value.length;
    isPlaying.value = true;
  }
  function repeatCurrentSong() {
    // currentIndex.value = (currentIndex.value + 1) % songs.value.length;
    isPlaying.value = true;
  }
  function setSong(index: number) {
    if (index >= 0 && index < songs.value.length) {
      currentIndex.value = index;
      isPlaying.value = true;
    }
  }
  /**
   * 由外部（如 MusicPlayer 功能）設定歌曲清單
   */
  function setSongs(newSongs: Song[], startIndex = 0) {
    songs.value = newSongs;
    currentIndex.value = startIndex;
    isPlaying.value = false;
  }

  function clearObjectUrl() {
    songs.value.forEach((item) => {
      URL.revokeObjectURL(item.url);
    });
  }

  function setRepeatMode(mode: 1 | 2) {
    repeatMode.value = mode;
  }
  return {
    songs,
    currentIndex,
    isPlaying,
    currentSong,
    repeatMode,
    play,
    pause,
    prevSong,
    nextSong,
    setSong,
    setSongs, // 匯出 setSongs 以供外部設定歌曲清單
    clearObjectUrl,
    setRepeatMode,
    repeatCurrentSong,
  };
});
