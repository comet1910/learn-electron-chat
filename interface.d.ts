import { CreateChatProps ,OnUpdatedCallback, AppConfig} from './src/types'

export interface IElectronAPI {
    startChat: (data: CreateChatProps) => void;
    onUpdateMessage: (callback: OnUpdatedCallback) => any;
    copyImageToUserDir: (sourcePath: string) => Promise<string>;
    getPathForFile: (file: File) => string;
    getConfig: () => Promise<AppConfig>;
    setConfig: (config: AppConfig) => Promise<AppConfig>;
}

declare global {
    interface Window {
        electronAPI: IElectronAPI
    }
    interface File {
        path: string
    }
}