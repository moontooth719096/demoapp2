import { HttpTransportType, HubConnectionBuilder, HubConnectionState } from "@microsoft/signalr";
import { getTokenCookie } from "@/utils/cookie";

const youtubedownloadhuburl = new URL(
  import.meta.env.VITE_DownloadHubUri,
  import.meta.env.VITE_API_BASE_URL
)?.href;

const youtubedDwnloadConnection = new HubConnectionBuilder()
  .withUrl(youtubedownloadhuburl, {
    accessTokenFactory: () => {
      const token = getTokenCookie();
      if (token) {
        return token; // 返回有效的字串
      } else {
        throw new Error("Token is null or undefined");
      }
    },
    skipNegotiation: true,
    transport: HttpTransportType.WebSockets
  })
  .withAutomaticReconnect()
  .build();

//建立下載連線
export async function Start() {
  if (youtubedDwnloadConnection.state !== HubConnectionState.Disconnected) {
    console.log('下載已經連線');
    return Promise.resolve();
  }
  try {
    await youtubedDwnloadConnection.start();
    console.log('下載連接已建立');
  } catch (error: any) {
    console.error('下載連接失敗:', error);
    throw error;
  }
}

// 等待連線成功
export async function WaitForConnection() {
  return new Promise<void>((resolve, reject) => {
    if (youtubedDwnloadConnection.state === HubConnectionState.Connected) {
      resolve();
    } else {
      youtubedDwnloadConnection.onclose(() => {
        reject(new Error("連線失敗"));
      });
      youtubedDwnloadConnection.onreconnected(() => {
        resolve();
      });
    }
  });
}

export function Disconnected() {
  youtubedDwnloadConnection.stop();
}
//取得連線ID
export async function GetConnectionId(): Promise<string | null> {
  return await youtubedDwnloadConnection.connectionId;
}

export const YoutubeDownloadProgress = (callback: (message:string , percentage: number) => void) => {
  youtubedDwnloadConnection.on("YoutubeDownloadProgress", (message:string ,percentage: number) => {
    console.log('YoutubeDownloadProgress:', message, percentage);
    callback(message,percentage);
  });
};

export const YoutubeDownloadCompleted = (callback: (downloadLink: string) => void) => {
  youtubedDwnloadConnection.on("YoutubeDownloadCompleted", (downloadLink: string) => {
    console.log('YoutubeDownloadCompleted:', downloadLink);
    callback(downloadLink);
  });
};

export default { Start, Disconnected,YoutubeDownloadProgress,YoutubeDownloadCompleted,GetConnectionId,WaitForConnection };