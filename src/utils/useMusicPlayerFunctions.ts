import type { Ref } from "vue";

export interface SongLike {
  name?: string;
  title?: string;
  url: string;
}

export function useMusicPlayerFunctions(
  songs: Ref<SongLike[]>,
  currentIndex: Ref<number>,
  audio: Ref<HTMLAudioElement | null>,
  isPlaying: Ref<boolean>,
  repeatMode: Ref<number> // Default to 'off'
) {
  const currentSong = () =>
    songs.value.length > 0 &&
    currentIndex.value >= 0 &&
    currentIndex.value < songs.value.length
      ? songs.value[currentIndex.value]
      : undefined;

  const play = () => {
    if (songs.value.length === 0) return;
    if (audio.value) {
      audio.value.play();
      isPlaying.value = true;
    }
  };
  const pause = () => {
    if (songs.value.length === 0) return;
    if (audio.value) {
      audio.value.pause();
      isPlaying.value = false;
    }
  };
  const prevSong = () => {
    if (songs.value.length === 0) return;
    currentIndex.value =
      (currentIndex.value - 1 + songs.value.length) % songs.value.length;
    reloadAndPlay();
  };
  const nextSong = () => {
    if (songs.value.length === 0) return;
    currentIndex.value = (currentIndex.value + 1) % songs.value.length;
    reloadAndPlay();
  };
  const reloadAndPlay = () => {
    if (songs.value.length === 0) return;
    if (audio.value) {
      audio.value.load();
      play();
    }
  };

  return {
    currentSong,
    play,
    pause,
    prevSong,
    nextSong,
    reloadAndPlay,
  };
}
