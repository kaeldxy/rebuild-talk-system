import {
    IawaitList,
    IcurrentConnects,
    IkefuInfo,
    IsingleMsg,
    IuserInfo,
    IkefuToServer
} from 'MyType'
import { Server } from 'socket.io'
import _ from 'lodash'
const mode = process.env.NODE_ENV === 'production'
console.log('mode', process.env.NOED_ENV)
const currentConnects: IcurrentConnects = {}
let awaitList: IawaitList = {}
const onlineKefus: IkefuInfo[] = []

export const socketHandler = (io: Server) => {
    const userNameSpace = io.of('/user')
    const kefuNameSpace = io.of('/kefu')

    userNameSpace
        .use((userSocket, next) => {
            if (mode && userSocket.handshake.xdomain) {
                userSocket.disconnect(true)
            } else {
                next()
            }
        })
        .on('connection', userSocket => {
            const userSocketId = userSocket.id
            const userInfo: IuserInfo = userSocket.handshake.query
            const kefu = _.minBy<IkefuInfo>(onlineKefus, 'sesstionNum')
            if (kefu) {
                currentConnects[userSocketId] = kefu
                kefuNameSpace
                    .to(kefu.kefuSocketId)
                    .emit('server_to_kefu-userinto', userInfo)
            } else {
                awaitList[userSocketId] = { userInfo, talkList: [] }
            }
            userSocket
                .on('user_to_server', (data: IsingleMsg) => {
                    if (awaitList[userSocketId]) {
                        awaitList[userSocketId].talkList.push(data)
                    } else {
                        kefuNameSpace
                            .to(currentConnects[userSocketId].kefuSocketId)
                            .emit('server_to_kefu', data)
                    }
                })
                .on('disconnect', (reason: string) => {})
        })

    const max = 10
    const timeOut = 3 * 60000
    const spliceAwaitList = () => {
        let count = 0
        const sendData: IawaitList = {}
        for (const userSocketId in awaitList) {
            count++
            if (count < max) {
                sendData[userSocketId] = awaitList[userSocketId]
                delete awaitList[userSocketId]
            } else {
                return { sendData, done: false }
            }
        }
        return { sendData, done: true }
    }
    kefuNameSpace
        .use((kefuSocket, next) => {
            if (mode && kefuSocket.handshake.xdomain) {
                kefuSocket.disconnect(true)
            } else {
                next()
            }
        })
        .on('connection', kefuSocket => {
            let timer: NodeJS.Timeout
            const kefu_id: string = kefuSocket.handshake.query
            const kefuSocketId = kefuSocket.id
            let sesstionNum
            if (_.isEmpty(awaitList)) {
                sesstionNum = 0
                onlineKefus.push({ kefu_id, kefuSocketId, sesstionNum })
            } else {
                const { sendData, done } = spliceAwaitList()
                kefuSocket.emit('server_to_kefu-awaitList', sendData)
                if (!done) {
                    timer = setInterval(() => {
                        if (!_.isEmpty(awaitList)) {
                            const { sendData, done } = spliceAwaitList()
                            kefuSocket.emit(
                                'server_to_kefu-awaitList',
                                sendData
                            )
                            if (done) {
                                clearInterval(timer)
                            }
                        }
                    }, timeOut)
                }
            }
            kefuSocket
                .on(
                    'kefu_to_server',
                    ({ data, userSocketId }: IkefuToServer) => {
                        userNameSpace
                            .to(userSocketId)
                            .emit('server_to_user', data)
                    }
                )
                .on('disconnect', (reason: string) => {
                    console.log(reason)
                })
        })
}
