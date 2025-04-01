<template>
  <div class="logview">
    <vue-good-table
      class="logboard"
      :columns="columns"
      :rows="logs"
      max-height="82%"
      :pagination-options="{ enabled: true, perPage: 10 }"
    >
      <template #table-actions>
        <button type="button" class="btn btn-primary btn-sm" @click="fetchLogs">
          Refresh
        </button>
      </template>
    </vue-good-table>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from "vue";
import { axiosBase } from "@/utils/ApiHelper";
import { LogViewDetail } from "@/types/LogView/LogViewDetail"; // 新增匯入
import store from "@/store";

const logs = ref<LogViewDetail[]>([]);
const columns = ref([
  {
    label: "時間",
    field: "Timestamp",
    type: "date",
    width: "15%",
    dateInputFormat: "yyyy-MM-dd'T'HH:mm:ss", // 修正格式
    dateOutputFormat: "yyyy-MM-dd HH:mm:ss", // outputs Mar 16th 2018
  },
  { label: "UserID", field: "UserID", width: "15%" },
  { label: "LogLevel", field: "LogLevelString", width: "10%" },
  { label: "Message", field: "Message", width: "50%" },
  { label: "呼叫端", field: "CallEndString", width: "10%" },
]);

const fetchLogs = async () => {
  store.dispatch("showLoading");
  let apihelper = axiosBase();
  try {
    const { data } = await apihelper.get<LogViewDetail[]>("/api/Log/read");

    //判斷回傳是否有值
    if (data !== null && data.length > 0) {
      logs.value = data;
    } else {
      return;
    }
  } catch (error) {
    console.error("Error fetching logs:", error);
  } finally {
    store.dispatch("hideLoading");
  }
};

onMounted(fetchLogs);
</script>

<style scoped lang="scss">
.logview {
  width: 100%;
  height: 100%;
  display: flex;
  justify-content: center;
  .logboard {
    padding: 1vw 1vh;
    width: 100%;
    height: 100%;
    ::v-deep(.vgt-inner-wrap) {
      height: 100%;
    }
  }
}
</style>
