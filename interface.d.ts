import { CreateChatProps ,OnUpdatedCallback} from './src/types'

export interface IElectronAPI {
    startChat: (data: CreateChatProps) => void;
    onUpdateMessage: (callback: OnUpdatedCallback) => any;
    copyImageToUserDir: (sourcePath: string) => Promise<string>;
    getPathForFile: (file: File) => string;
}

declare global {
    interface Window {
        electronAPI: IElectronAPI
    }
    interface File {
        path: string
    }
}