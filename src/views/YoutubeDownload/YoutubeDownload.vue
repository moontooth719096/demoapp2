<template>
  <div id="YoutubeDonloadApp" class="row g-0 mt-2 justify-content-center">
    <div class="row">
      <input type="text" class="col-9 m-1" v-model="inputUrl" ref="urlinput" />
      <button class="btn btn-primary col-1 m-1" @onclick="listget" v-bind:disabled="!inputUrl">Search</button>
      <!-- <button id="Download_Btn" class="btn btn-warning col-1 m-1" :onclick="download" v-bind:disabled="searchDatas.length <= 0" ref="downloadbtn">
        Download
      </button> -->
    </div>
    <div class="row m-1">
      <table class="table table-bordered table-hover">
        <tbody>
          <tr v-for="item in searchDatas" :model="searchDatas" style="height: 15%">
            <td class="w-5 align-middle text-center">
              <input type="checkbox" :id="item.id" v-model="item.ischeck" />
            </td>
            <td class="w-auto text-center">
              <a :href="item.url" target="_blank">
                <img style="width: 6.25rem" :src="item.thumbnailUrl" class="img-fluid img-thumbnail" alt="..." />
              </a>
            </td>
            <td class="w-auto align-middle">
              {{ item.title }}
            </td>
            <td class="w-5 align-middle text-center">
              {{ item.playTime }}
            </td>
          </tr>
        </tbody>
      </table>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref } from "vue";
import axios from "axios";
interface SearchData {
  id: string;
  ischeck: boolean;
  url: string;
  thumbnailUrl: string;
  title: string;
  playTime: string;
}
let searchDatas = ref<SearchData[]>();
const inputUrl: string = "";

const listget = async (inputUrl: string) => {
  const params = {
    PlaylistId: inputUrl,
  };
  searchDatas = await axios.get("/api/YoutubeDownload/PlayListGet", {
    params: params,
  });
};
</script>

<style scoped></style>
