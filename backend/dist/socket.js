"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.socketHandler = void 0;
const mode = process.env.NODE_ENV === 'production';
console.log(mode);
const currentConnects = {};
let awaitList = {};
const onlineKefus = [];
exports.socketHandler = (io) => {
    const userNameSpace = io.of('/user');
    const kefuNameSpace = io.of('/kefu');
    userNameSpace
        .use((userSocket, next) => {
        if (mode && userSocket.handshake.xdomain) {
            userSocket.disconnect(true);
        }
        else {
            next();
        }
    })
        .on('connection', userSocket => {
        const userSocketId = userSocket.id;
        const userInfo = userSocket.handshake.query;
        if (onlineKefus.length) {
        }
        else {
        }
        userSocket
            .on('user_to_server', (data) => {
            userSocket.
            ;
        })
            .on('disconnect', (reason) => {
        });
    });
};
