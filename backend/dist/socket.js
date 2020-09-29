"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.socketHandler = void 0;
const lodash_1 = __importDefault(require("lodash"));
const mode = process.env.NODE_ENV === 'production';
console.log('mode:  ', process.env.NOED_ENV);
const currentConnects = {};
let awaitList = {};
const onlineKefus = [];
exports.socketHandler = (io) => {
    const userNameSpace = io.of('/user');
    const kefuNameSpace = io.of('/kefu');
    const max = 10;
    const timeOut = 3 * 60000;
    const spliceAwaitList = () => {
        let count = 0;
        const sendData = {};
        for (const userSocketId in awaitList) {
            count++;
            if (count < max) {
                sendData[userSocketId] = awaitList[userSocketId];
                delete awaitList[userSocketId];
            }
            else {
                return { sendData, done: false };
            }
        }
        return { sendData, done: true };
    };
    const names = ['user', 'kefu'];
    io.use((socket, next) => {
        const name = socket.nsp.name;
        if (!names.includes(name))
            return socket.disconnect(true);
        if (mode && socket.handshake.xdomain)
            return socket.disconnect(true);
        next();
    });
    userNameSpace
        .use((userSocket, next) => {
        next();
    })
        .on('connection', userSocket => {
        const userSocketId = userSocket.id;
        const userInfo = userSocket.handshake.query;
        const kefu = lodash_1.default.minBy(onlineKefus, 'sesstionNum');
        if (kefu) {
            kefu.sesstionNum++;
            currentConnects[userSocketId];
            kefuNameSpace
                .to(kefu.kefuSocketId)
                .emit('server_to_kefu-userinto', userInfo);
        }
        else {
            awaitList[userSocketId] = { userInfo, talkList: [] };
        }
        userSocket
            .on('user_to_server', (data) => {
            if (awaitList[userSocketId]) {
                awaitList[userSocketId].talkList.push(data);
            }
            else {
                kefuNameSpace
                    .to(currentConnects[userSocketId].kefuSocketId)
                    .emit('server_to_kefu', data);
            }
        })
            .on('disconnect', (reason) => {
            if (awaitList[userSocketId]) {
                delete awaitList[userSocketId];
            }
            if (currentConnects[userSocketId]) {
                delete currentConnects[userSocketId];
                kefuNameSpace
                    .to(currentConnects[userSocketId].kefuSocketId)
                    .emit('server_to_kefu-disconnect', userSocketId);
            }
        });
    });
    kefuNameSpace
        .use((kefuSocket, next) => {
        if (mode && kefuSocket.handshake.xdomain) {
            kefuSocket.disconnect(true);
        }
        else {
            next();
        }
    })
        .on('connection', kefuSocket => {
        let timer;
        const kefu_id = kefuSocket.handshake.query;
        const kefuSocketId = kefuSocket.id;
        let sesstionNum;
        if (lodash_1.default.isEmpty(awaitList)) {
            sesstionNum = 0;
            onlineKefus.push({ kefu_id, kefuSocketId, sesstionNum });
        }
        else {
            const { sendData, done } = spliceAwaitList();
            kefuSocket.emit('server_to_kefu-awaitList', sendData);
            if (!done) {
                timer = setInterval(() => {
                    if (!lodash_1.default.isEmpty(awaitList)) {
                        const { sendData, done } = spliceAwaitList();
                        kefuSocket.emit('server_to_kefu-awaitList', sendData);
                        if (done) {
                            clearInterval(timer);
                        }
                    }
                }, timeOut);
            }
        }
        kefuSocket
            .on('kefu_to_server', ({ data, userSocketId }) => {
            userNameSpace
                .to(userSocketId)
                .emit('server_to_user', data);
        })
            .on('disconnect', (reason) => {
            console.log(reason);
        });
    });
};
