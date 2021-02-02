import Vuex from 'vuex';
import Vue from 'vue';

Vue.use(Vuex);

const store = new Vuex.Store({
    modules: {
        user: {
            state: {},
            mutations: {},
            actions: {},
        },
    },
    state: {
        uid: localStorage.getItem('uid') || 0,
        roomId: 0,
        online: 0,
        maxMsgLength: 600,
        messages: [],
    },
    mutations: {
        setUid(state, uid) {
            state.uid = uid;
        },
        setRoomId(state, roomId) {
            if (state.roomId !== roomId) {
                state.messages = [];
                state.online = 0;
            }
            state.roomId = roomId;
        },
        setOnline(state, total) {
            state.online = total || 0;
        },
        appendMessage(state, message) {
            state.messages.push(message);
            const time2 = Date.now() - 10000;
            state.messages = state.messages.filter(({ time, isEnter }) => !isEnter || time > time2);
            if (state.messages.length > state.maxMsgLength) {
                state.messages.splice(0, state.messages.length - state.maxMsgLength / 2);
            }
        },
    },
});

export default store;
