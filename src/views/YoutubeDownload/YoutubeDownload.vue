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
        @click="listget"
      >
        <div class="btn_text">Search</div>
        <i class="btn_icon bi bi-search"></i>
      </button>
      <button
        id="Download_btn"
        class="download_btn btn btn-warning text-center"
        type="button"
        @click="download(1)"
        v-if="searchDatas.length > 0"
      >
        <div class="btn_text">Download</div>
        <i class="btn_icon bi bi-download"></i>
      </button>
      <button
        id="GDownload_btn"
        class="download_btn btn btn-outline-info text-center"
        type="button"
        @click="Gdownload"
        v-if="searchDatas.length > 0"
      >
        <img
          style="width: 1rem"
          src="@/assets/images/googledriveicon.png"
          class="img-fluid"
          alt="..."
        />
      </button>
      <drive-picker
        :client-id="clientId"
        :developer-key="developerKey"
        :app-id="appId"
        ref="googlepicker"
        v-if="showGDownload"
      >
        <drive-picker-docs-view
          select-folder-enabled="true"
          include-folders="true"
          owned-by-me="true"
          mime-types="application/vnd.google-apps.folder"
          multi-select-enabled="false"
        ></drive-picker-docs-view>
      </drive-picker>
    </div>
    <vue-good-table
      class="databroad"
      :columns="columns"
      :rows="searchDatas"
      :select-options="{
        checked: true,
        enabled: tablecheckedEnable,
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
import { ref, onUnmounted, computed, onMounted, nextTick, watch } from "vue";
import { axiosBase, RespType } from "@/utils/ApiHelper";
import Swal from "sweetalert2";
import store from "@/store";
import {
  Start as DownloadStart,
  Disconnected as DownloadDisconnected,
} from "@/utils/YoutubeDownloadHubHelper";
import { Log } from "@/utils/Log";
import "@googleworkspace/drive-picker-element";
import { UserInfo } from "@/types/UserInfo";

const userInfo = computed(() => store.getters.userInfo) as UserInfo;

const clientId =
  "607977203990-5s5ur3sgv55i7gr4h8eapuuq8jvh0pim.apps.googleusercontent.com";
const developerKey = "AIzaSyDvNQoLBk9zBR5BGU4ksxJh-_UuCiH2SQo";
const appId = "607977203990";

const currentGAuthToken = ref("");

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

const downloadProgress = ref(0);
const downloadmessage = ref("");
const googlepicker = ref<any | null>(null);
const showGDownload = ref(false);
const authToken = ref<string | undefined>("");
const selectFileID = ref<string | undefined>("");
const tablecheckedEnable = ref<boolean>(true);

onMounted(() => {
  authToken.value =
    userInfo.ThirdPlatform == "Google" ? userInfo.ThirdToken : "";
});

onUnmounted(() => {
  DownloadDisconnected();
  if (googlepicker.value) {
    // 先移除舊的監聽，避免重複
    googlepicker.value.removeEventListener("picker:picked", onPicked);
    googlepicker.value.removeEventListener("picker:error", onError);
    googlepicker.value.removeEventListener(
      "picker:authenticated",
      onAuthenticated
    );
  }
});

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
    Log(`清單查詢發生例外:${error}`, 4);
    Swal.fire({
      icon: "error",
      text: "清單查詢發生例外",
    });
    return;
  } finally {
    //確保無論如何都會隱藏loading
    store.dispatch("hideLoading");
  }
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
  let apihelper = axiosBase(10000);
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
  let apihelper = axiosBase(10000);
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

const download = async (mode: number) => {
  store.dispatch("showLoading");
  tablecheckedEnable.value = false;
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
      Swal.fire({
        icon: "error",
        text: "沒有選擇任何歌曲",
      });
      return;
    }

    DownloadStart(mode, handleDownloadProgress, handleDownloadCompleted);

    let result = await apihelper.post("/api/YoutubeDownload/Download", {
      ConnectionId: "",
      SelectData: downloadlist,
      Mode: mode,
      GAuthToken: currentGAuthToken.value,
      SelectFileID: selectFileID.value,
    });
    if (result !== null && result !== undefined) {
      isDownload.value = true;
    }
  } catch (error) {
    console.error(error);
    Log(`下載失敗:${error}`, 4);
    isDownload.value = false;
    tablecheckedEnable.value = true;
    Swal.fire({
      icon: "error",
      text: "下載發生例外",
    });
  } finally {
    store.dispatch("hideLoading");
  }
};

const Gdownload = async () => {
  showGDownload.value = true;
  if (!googlepicker.value.visible) {
    googlepicker.value.visible = true;
  }
};

const handleDownloadCompleted = (
  mode: number,
  fileName: string,
  downloadLink: string
) => {
  if (mode === 1) {
    const link = document.createElement("a");
    link.href = new URL(downloadLink, import.meta.env.VITE_API_BASE_URL)?.href;
    link.download = fileName;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  } else {
    showGDownload.value = false;
    Swal.fire({
      icon: "success",
      text: "已儲存至GoogleDrive",
    });
  }

  DownloadDisconnected();
  store.dispatch("hideLoading");
  isDownload.value = false;
  tablecheckedEnable.value = true;
  resetDownloadProgress();
};

const onPicked = async (event: any) => {
  // event.detail.files 取得選取的檔案
  const a = 1;
  selectFileID.value = event.detail.docs[0].id;
  console.log(selectFileID.value);
  if (selectFileID.value) {
    await download(2);
  }
};

const onError = (event: any) => {
  const a = 1;
  console.log(event.detail.files);
};
const onAuthenticated = (event: any) => {
  currentGAuthToken.value = event.detail?.token;
};
watch(showGDownload, async (val) => {
  if (val) {
    await nextTick();
    if (googlepicker.value) {
      // 加入新的監聽
      googlepicker.value.addEventListener("picker:picked", onPicked);
      googlepicker.value.addEventListener("picker:error", onError);
      googlepicker.value.addEventListener(
        "picker:authenticated",
        onAuthenticated
      );
    }
  }
});
</script>

<style scoped>
@import "@/assets/styles/YoutubeDownload/YoutubeDownload.scss";
</style>
