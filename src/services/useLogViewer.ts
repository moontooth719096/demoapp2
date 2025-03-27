import { ref, onMounted } from 'vue';
import { axiosBase, RespType } from "@/utils/ApiHelper";

export function useLogViewer() {
  const logs = ref([]);
  const columns = ref([
    { label: 'Timestamp', field: 'Timestamp' },
    { label: 'Message', field: 'Message' },
  ]);

  const fetchLogs = async () => {
    let apihelper = axiosBase();
    try {
      const { data } = await apihelper.get("/api/Log/read");
    
      //判斷回傳是否有值
      if (data !== null && data.length > 0) {
         logs.value = data;
      } else {
        return;
      }
    } catch (error) {
      console.error('Error fetching logs:', error);
    }
  };

  onMounted(fetchLogs);

  return { logs, columns };
}
