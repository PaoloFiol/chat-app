import config from '../config';

const ChatService = {
    createWebSocket(protocols) {
        const protocolString = encodeURIComponent(`${protocols.username},${protocols.roomId}`)
        return new WebSocket(`ws://${config.server.host}:${config.server.websocketPort}`, protocolString);
    },

    endpoint(query) {
        return `http://${config.server.host}:${config.server.port}/${query}`;
    },

    checkIfRoomExists(roomId) {
        const url = this.endpoint(`check_if_room_exists?roomId=${roomId}`);
        return fetch(url).then(response => response.json());
    },

    checkIfUsernameExists(username, roomId) {
        const url = this.endpoint(`check_if_username_exists?roomId=${roomId}&username=${username.trim()}`)
        return fetch(url).then(response => response.json());
    },

    createRoom(username) {
        const url = this.endpoint(`create_room?username=${username}`);
        return fetch(url).then(response => response.json());
    },

    joinRoom(username, roomId) {
        const url = this.endpoint(`join_room?roomId=${roomId}&username=${username.trim()}`);
        return fetch(url).then(response => response.json());
    }
};

export default ChatService;