import { ipcMain } from 'electron';

const CHANNEL = 'CHANNEL';
let events = {};

class IpcMainUtil {

    static initial() {
        events = {};
        ipcMain.on(CHANNEL, async (event, args) => {
            let { id, type, payload } = args;
            if (events[type]) {
                payload = await events[type](payload);
                event.sender.send(CHANNEL, {
                    id,
                    payload,
                });
            } else {
                event.sender.send(CHANNEL, {
                    id,
                });
            }
        });
    }

    static on(type, callback) {
        events[type] = callback;
    }
}

export default IpcMainUtil;
