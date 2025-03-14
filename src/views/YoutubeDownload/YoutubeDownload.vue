<template>
  <div id="YoutubeDonloadApp">
    <div v-if="isDownload" class="progress">
      <p>{{ downloadmessage }}</p>
      <div
        class="progress-bar"
        role="progressbar"
        :style="{ width: downloadProgress + '%' }"
        :aria-valuenow="downloadProgress"
        aria-valuemin="0"
        aria-valuemax="100"
      >
        {{ downloadProgress }}%
      </div>
    </div>
    <div v-else class="searchboard">
      <input
        type="text"
        class="form-control search_input"
        name="youtubeurl"
        id="youtubeurl"
        aria-describedby="helpId"
        placeholder="請填入youtube影片網址"
        v-model.trim="inputUrl"
        ref="urlinput"
        required
      />
      <button
        id="Search_btn"
        name="Search_btn"
        type="button"
        class="search_btn btn btn-primary"
        :disabled="!inputUrlHaveValue"
        :onclick="listget"
      >
        <div class="btn_text">Search</div>
        <i class="btn_icon bi bi-search"></i>
      </button>
      <button
        id="Download_btn"
        class="download_btn btn btn-warning text-center"
        type="button"
        :onclick="download"
        :disabled="searchDatas.length <= 0"
      >
        <div class="btn_text">Download</div>
        <i class="btn_icon bi bi-download"></i>
      </button>
    </div>
    <!-- <div class="databroad" style="width: 98%">
      <DataTable
        id="SearchResultTable"
        class="table table-bordered table-hover"
        :data="searchDatas"
        :columns="columns"
        :options="{ responsive: true, paging: true }"
        ref="SearchResultTable"
      />
    </div> -->
    <vue-good-table
      class="databroad"
      :columns="columns"
      :rows="searchDatas"
      :select-options="{
        checked: true,
        enabled: true,
        disableSelectInfo: true,
        selectAllByGroup: true,
        alwaysShowSelectionInfo: false,
      }"
      ref="SearchResultTable"
      compactMode
    >
      <template #table-row="props">
        <span v-if="props.column.field == 'ThumbnailUrl'">
          <a :href="props.row.Url" target="_blank">
            <img
              style="width: 6.25rem"
              :src="props.row.ThumbnailUrl"
              class="img-fluid img-thumbnail"
              alt="..."
            />
          </a>
        </span>
      </template>
    </vue-good-table>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, nextTick } from "vue";
import { axiosBase, RespType } from "@/utils/ApiHelper";
import Swal from "sweetalert2";
import store from "@/store";
import DataTable from "datatables.net-vue3";
import DataTablesCore from "datatables.net-bs5";
import "datatables.net-buttons-bs5";
import "datatables.net-buttons/js/buttons.colVis.mjs";
import "datatables.net-buttons/js/buttons.html5.mjs";
import "datatables.net-fixedheader-bs5";
import Responsive from "datatables.net-responsive-bs5";
import {
  Start as DownloadStart,
  Disconnected as DownloadDisconnected,
} from "@/utils/YoutubeDownloadHubHelper";
import $ from "jquery";

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

const searchDatas = ref<SearchData[]>([]);
const inputUrl = ref<string>("");
const isDownload = ref<boolean>(false);
const SearchResultTable = ref<any | null>(null);

DataTable.use(DataTablesCore);
DataTable.use(Responsive); // ← 啟用 Responsive 插件

const downloadProgress = ref(0);
const downloadmessage = ref("");

const columns = [
  {
    label: "縮圖",
    field: "ThumbnailUrl",
    sortable: false,
    tdClass: "w-auto text-center",
  },
  {
    label: "標題",
    field: "Title",
    type: "string",
    sortable: false,
    tdClass: "w-auto align-middle",
  },
  {
    label: "播放時間",
    field: "PlayTime",
    type: "string",
    tdClass: "w-5 align-middle text-center",
    sortable: true,
    firstSortType: "desc",
  },
];

const handleDownloadProgress = (message: string, percentage: number) => {
  downloadmessage.value = message;
  downloadProgress.value = percentage;
};

const resetDownloadProgress = () => {
  downloadProgress.value = 0;
  downloadmessage.value = "";
};

// const columns = [
//   {
//     title: `<input type="checkbox" id="select-all" checked/>`,
//     data: "Id",
//     orderable: false, // 禁止排序
//     render: (data: any, type: any, row: { IsCheck: any }) => {
//       return `<input type="checkbox" class="row-checkbox" data-id="${data}" ${
//         row.IsCheck ? "checked" : ""
//       } />`;
//     },
//   },
//   {
//     title: "縮圖",
//     data: "ThumbnailUrl",
//     render: (data: any, type: any, row: { Url: any }) => {
//       return `<a href="${row.Url}" target="_blank">
//                 <img style="width: 6.25rem" src="${data}" class="img-fluid img-thumbnail" alt="..." />
//               </a>`;
//     },
//   },
//   { title: "標題", data: "Title" },
//   { title: "播放時間", data: "PlayTime" },
// ];

const toggleAllCheckboxes = () => {
  const isChecked = $("#select-all").is(":checked");
  searchDatas.value.forEach((item) => {
    item.IsCheck = isChecked;
  });
};

onMounted(() => {
  nextTick(() => {
    $("#SearchResultTable").on("click", "#select-all", toggleAllCheckboxes);
  });
});

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
  try {
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
  } catch (error) {
    console.error(error);
    store.dispatch("hideLoading");
    Swal.fire({
      icon: "error",
      text: "查無資料",
    });
    return;
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
  try {
    const apihelper = axiosBase(300000, undefined, RespType.blob);
    const nowlist = searchDatas.value;
    //篩選有勾選的資料
    const downloadlist = SearchResultTable.value.selectedRows;

    // nowlist.filter((x) => x.IsCheck).map(({ Id, Title }) => ({ Id, Title }));
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
    DownloadStart(handleDownloadProgress, handleDownloadCompleted);

    let result = await apihelper.post("/api/YoutubeDownload/Download", {
      ConnectionId: "",
      SelectData: downloadlist,
    });
    if (result !== null && result !== undefined) {
      isDownload.value = true;
    }
  } catch (error) {
    console.error(error);
    store.dispatch("hideLoading");
    isDownload.value = false;
    Swal.fire({
      icon: "error",
      text: "下載失敗",
    });
  }
};

const handleDownloadCompleted = (fileName: string, downloadLink: string) => {
  const link = document.createElement("a");
  link.href = new URL(downloadLink, import.meta.env.VITE_API_BASE_URL)?.href;
  link.download = fileName;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  DownloadDisconnected();
  store.dispatch("hideLoading");
  isDownload.value = false;
  resetDownloadProgress();
};
</script>

<style scoped>
@import "@/assets/styles/YoutubeDownload/YoutubeDownload.scss";
</style>
