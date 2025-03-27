<template>
  <div>
    <h1>API Log Viewer</h1>
    <vue-good-table
      :columns="columns"
      :rows="logs"
      :pagination-options="{ enabled: true, perPage: 10 }"
    />
  </div>
</template>

<script lang="ts">
import { defineComponent } from "vue";
import { useLogViewer } from "../../services/useLogViewer";

export default defineComponent({
  name: "LogViewer",
  setup() {
    const { logs, columns } = useLogViewer();
    return { logs, columns };
  },
});
</script>

<style scoped>
h1 {
  margin-bottom: 20px;
}
</style>
