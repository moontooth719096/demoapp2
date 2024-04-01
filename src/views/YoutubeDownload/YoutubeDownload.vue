<template>
  <div id="YoutubeDonloadApp" class="row g-0 justify-content-center">
    <form class="row g-3 needs-validation">
      <div class="mb-2 col-9">
        <label for="youtubeurl" class="form-label mb-1">youtube影片網址</label>
        <input
          type="text"
          class="form-control col-9 mb-1"
          name="youtubeurl"
          id="youtubeurl"
          aria-describedby="helpId"
          placeholder="請填入youtube影片網址"
          v-model.trim="inputUrl"
          ref="urlinput"
          required />
      </div>
      <div class="mb-2 col-1">
        <label for="Search_btn" class="form-label mb-1">&nbsp;</label>
        <br />
        <button id="Search_btn" name="Search_btn" type="button" class="btn btn-primary mb-1" :disabled="!inputUrlHaveValue" :onclick="listget">Search</button>
      </div>
    </form>
    <div class="row m-1">
      <table class="table table-bordered table-hover">
        <tbody>
          <tr v-for="item in searchDatas" style="height: 15%">
            <td class="w-5 align-middle text-center">
              <input type="checkbox" :id="item.id" v-model="item.isCheck" />
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
import axios from "@/utils/ApiHelper";

interface SearchData {
  id: string;
  isCheck: boolean;
  url: string;
  thumbnailUrl: string;
  title: string;
  playTime: string;
}

let searchDatas = ref<SearchData[]>([]);
const inputUrl = ref<string>("");

const listget = async () => {
  const inputurl = encodeURI(inputUrl.value);
  const params = {
    PlaylistId: inputurl,
  };
  const { data } = await axios.get<SearchData[]>("/api/YoutubeDownload/PlayListGet", {
    params: params,
  });
  searchDatas.value = data;
};

const inputUrlHaveValue = () => {
  if (inputUrl !== null && inputUrl !== undefined) {
    return true;
  } else {
    return false;
  }
};
</script>

<style scoped></style>
