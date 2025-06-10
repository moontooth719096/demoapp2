import { axiosBase } from "@/utils/ApiHelper";
import { LogLevel } from "@/types/CallLog";

export async function Log(message: string, level: LogLevel): Promise<void> {
  const apiHelp = axiosBase();
  const postdata = {
    Message: message,
    LogLevel: level,
    CallEnd: 1,
  };
  try {
    await apiHelp.post(import.meta.env.VITE_LOGURI, postdata);
  } catch {}
}
