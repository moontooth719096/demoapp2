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
          required
        />
      </div>
      <div class="mb-2 col-1">
        <label for="Search_btn" class="form-label mb-1">&nbsp;</label>
        <br />
        <button
          id="Search_btn"
          name="Search_btn"
          type="button"
          class="btn btn-primary mb-1"
          :disabled="!inputUrlHaveValue"
          :onclick="listget"
        >
          Search
        </button>
      </div>
      <div class="mb-2 col-1">
        <label for="Download_btn" class="form-label mb-1">&nbsp;</label>
        <br />
        <button
          id="Download_btn"
          class="btn btn-warning mb-1"
          type="button"
          :onclick="download"
          :disabled="searchDatas.length <= 0"
        >
          Download
        </button>
      </div>
    </form>
    <div class="row m-1">
      <table class="table table-bordered table-hover">
        <tbody>
          <tr v-for="item in searchDatas" style="height: 15%">
            <td class="w-5 align-middle text-center">
              <input type="checkbox" :id="item.Id" v-model="item.IsCheck" />
            </td>
            <td class="w-auto text-center">
              <a :href="item.Url" target="_blank">
                <img
                  style="width: 6.25rem"
                  :src="item.ThumbnailUrl"
                  class="img-fluid img-thumbnail"
                  alt="..."
                />
              </a>
            </td>
            <td class="w-auto align-middle">
              {{ item.Title }}
            </td>
            <td class="w-5 align-middle text-center">
              {{ item.PlayTime }}
            </td>
          </tr>
        </tbody>
      </table>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref } from "vue";
import { axiosBase, RespType } from "@/utils/ApiHelper";
import Swal from "sweetalert2";
import store from "@/store";

enum UrlType {
  "PlayListType",
  "VedioType",
}

interface SearchData {
  Id: string;
  IsCheck: boolean;
  Url: string;
  ThumbnailUrl: string;
  Title: string;
  PlayTime: string;
}

interface getIDmodle {
  Type?: UrlType;
  ID?: string;
}

let searchDatas = ref<SearchData[]>([]);
const inputUrl = ref<string>("");

const listget = async () => {
  store.dispatch("showLoading");
  searchDatas.value = [];
  const inputurl = inputUrl.value;
  //檢查傳入資料格式
  let isNotOK = listGetCheck(inputurl);
  if (isNotOK) {
    store.dispatch("hideLoading");
    return;
  }

  //判斷是ListID 還是 VideoID
  const checkGet: getIDmodle = getID(inputurl);
  if (checkGet.Type == null || checkGet.Type === undefined) {
    store.dispatch("hideLoading");
    //判斷沒有跳出錯誤訊息
    Swal.fire({
      icon: "error",
      text: "請確認您輸入的是合法的網址",
    });

    return;
  }

  //依照Type呼叫API
  switch (checkGet.Type) {
    case UrlType.VedioType:
      if (checkGet.ID !== undefined) {
        await videoAPICall(checkGet.ID);
      }
      break;
    case UrlType.PlayListType:
      if (checkGet.ID !== undefined) {
        await playListAPICall(checkGet.ID);
      }
      break;
    default:
      break;
  }
  store.dispatch("hideLoading");
};

const getID = (url: string): getIDmodle => {
  let result: getIDmodle = {};
  // 獲取 "list" 參數的值
  const listParam = getUrlParamKey(url, "list");
  if (listParam !== null && listParam !== undefined && listParam != "") {
    //判斷有list參數 存入變數
    result = {
      Type: UrlType.PlayListType,
      ID: listParam,
    };
    return result;
  }

  // 獲取 "v" 參數的值
  const videoID = getUrlParamKey(url, "v");
  if (videoID !== null && videoID !== undefined && videoID != "") {
    //判斷有v參數 存入變數
    result = {
      Type: UrlType.VedioType,
      ID: videoID,
    };
    return result;
  }
  return result;
};

const listGetCheck = (inputdata: string) => {
  //判斷傳入的質是否為空
  if (inputdata === null || inputdata === undefined || inputdata === "") {
    Swal.fire({
      icon: "error",
      text: "請輸入網址或是ListID",
    });
    return true;
  }
  //判斷輸入的是不是網址
  if (!isUrlPath(inputdata)) {
    Swal.fire({
      icon: "error",
      text: "請輸入網址或是ListID",
    });
    return true;
  }
  return false;
};

const isUrlPath = (urlpath: string) => {
  // 定義簡單的URL正規表達式
  const regex = /^(https?:\/\/)?([\w-]+(\.[\w-]+)+\/?)([\w-./?%&=]*)?$/;
  // 使用正規表達式進行匹配
  return regex.test(urlpath);
};

const getUrlParamKey = (url: string, key: string) => {
  let urlParams = new URLSearchParams(new URL(url).search);
  // 獲取 "list" 參數的值
  let listParam = urlParams.get(key);
  return listParam;
};

const inputUrlHaveValue = () => {
  if (inputUrl !== null && inputUrl !== undefined) {
    return true;
  } else {
    return false;
  }
};
const videoAPICall = async (videoid: string) => {
  let apihelper = axiosBase();
  const inputurlencode = encodeURI(videoid);
  const params = {
    VideoID: videoid,
  };
  const { data } = await apihelper.get("/api/YoutubeDownload/VideoGet", {
    params: params,
  });

  //判斷回傳是否有值
  if (data !== null && data.length > 0) {
    searchDatas.value = data;
  } else {
    Swal.fire({
      icon: "error",
      text: "查無資料",
    });
    return;
  }
};

const playListAPICall = async (playlistid: string) => {
  let apihelper = axiosBase();
  const inputurlencode = encodeURI(playlistid);
  const params = {
    PlaylistId: playlistid,
  };
  const { data } = await apihelper.get("/api/YoutubeDownload/PlayListGet", {
    params: params,
  });

  //判斷回傳是否有值
  if (data !== null && data.length > 0) {
    searchDatas.value = data;
  } else {
    Swal.fire({
      icon: "error",
      text: "查無資料",
    });
    return;
  }
};

const download = async () => {
  store.dispatch("showLoading");
  let apihelper = axiosBase(300000, undefined, RespType.blob);
  let nowlist = searchDatas.value;
  //篩選有勾選的資料
  let downloadlist = nowlist
    .filter((x) => x.IsCheck)
    .map(({ Id, Title }) => ({ Id, Title }));
  if (
    downloadlist === null ||
    downloadlist === undefined ||
    downloadlist.length <= 0
  ) {
    store.dispatch("hideLoading");
    Swal.fire({
      icon: "error",
      text: "沒有選擇任何歌曲",
    });
    return;
  }

  let result = await apihelper.post(
    "/api/YoutubeDownload/Download",
    downloadlist,
    {
      responseType: "blob",
    }
  );
  if (result !== null && result.data !== null) {
    let downloaddata = result.data;
    downloadData(result);
  }
  store.dispatch("hideLoading");
};

const downloadData = (data: any) => {
  const url = window.URL.createObjectURL(
    new Blob([data.data], { type: data.headers["content-type"] })
  );
  let link = document.createElement("a");
  link.style.display = "none";
  link.href = url;

  let timestamp = new Date().getTime();
  link.download = `${timestamp}.zip`;
  document.body.appendChild(link);
  link.click();
  //  this.downloadComplate();
  //  document.getElementById('Download_Btn').disabled = false;
};
</script>

<style scoped></style>
