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
      <div class="mb-2 col-1">
        <label for="Download_btn" class="form-label mb-1">&nbsp;</label>
        <br />
        <button id="Download_btn" class="btn btn-warning mb-1" type="button" :onclick="download" :disabled="searchDatas.length<=0">Download</button>
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
import {axiosBase,ContentType} from "@/utils/ApiHelper";
// import type {ResponseType} from 'axios';

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
  let apihelper = axiosBase();
  const inputurl = encodeURI(inputUrl.value);
  const params = {
    PlaylistId: inputurl,
  };
  const { data } = await apihelper("/api/YoutubeDownload/PlayListGet", {
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

const download =async()=>{
  let apihelper = axiosBase(300000,undefined,'blob');
  let nowlist = searchDatas.value;
    //篩選有勾選的資料
  let downloadlist =  nowlist.filter(x=>x.isCheck).map(({id,title})=>({id,title}));
  let result = await apihelper.post('/api/YoutubeDownload/Download', downloadlist,{
    responseType: 'blob',
});
  if (result !== null && result.data !== null) {
   let downloaddata = result.data;
    downloadData(result);
  }
}

const  downloadData= (data:any)=> {
    const url = window.URL.createObjectURL(new Blob([data.data],  { type: data.headers['content-type'] }));
     let link = document.createElement('a')
     link.style.display = 'none'
     link.href = url

     let timestamp = new Date().getTime();
     link.download = `${timestamp}.zip`;
     document.body.appendChild(link);
     link.click();
    //  this.downloadComplate();
    //  document.getElementById('Download_Btn').disabled = false;
 }
</script>

<style scoped></style>
