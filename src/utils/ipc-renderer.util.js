import { ipcRenderer } from 'electron';
import DataUtil from '@/utils/data.util';

const CHANNEL = 'CHANNEL';

class IpcRendererUtil {
    static events = {};

    static initial() {
        ipcRenderer.on(CHANNEL, (event, args) => {
            const { id, payload } = args;
            if (IpcRendererUtil.events[id]) {
                IpcRendererUtil.events[id](payload);
            }
        });
    }

    static send(type, payload) {
        return new Promise(resolve => {
            const id = DataUtil.generateId();
            IpcRendererUtil.events[id] = resolve;
            ipcRenderer.send(CHANNEL, {
                id,
                type,
                payload,
            });
        });
    }

    static on(type, callback) {
        console.log(type, callback);
    }
}

export default IpcRendererUtil;
