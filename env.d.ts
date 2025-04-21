/// <reference types="vite/client" />
interface ImportMetaEnv {
  readonly VITE_AXIOS_TIMEOUT: number;
  readonly VITE_API_BASE_URL: string;
  readonly VITE_API_LOGINCHECK: string;
  readonly VITE_GoogleLoginUri: string;
  readonly VITE_ChatHubUri: string;
  readonly VITE_DownloadHubUri: string;
  readonly VITE_LogUri: string;
  readonly VITE_GoogleAPIKey: string;
  readonly VITE_GoogleClientId: string;
  readonly VITE_GoogleAppId: string;
}

interface ImportMeta {
  readonly env: ImportMetaEnv;
}
