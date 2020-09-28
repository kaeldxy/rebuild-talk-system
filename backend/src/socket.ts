import {
    //基础类型
    IawaitList,
    IcurrentConnect,
    IkefuInfo,
    IsingleMsg,
    IuserInfo,
    // socket接口数据
    IkefuToServer,
    IserverToKefu,
    IserverToKefu_userinto,
    IserverToKefu_awaitList,
    IuserToServer
} from 'MyType'
import { Server, Socket } from 'socket.io'
import _ from 'lodash'

const isProduction = process.env.NODE_ENV === 'production'

const currentConnects: IcurrentConnect = {}
let awaitList: IawaitList = {}
const onlineKefus: IkefuInfo[] = []

export const socketHandler = (io: Server) => {
    const userNameSpace = io.of('/user')
    const kefuNameSpace = io.of('/kefu')
    const kefuMaxTimeOut = 3
    const kefuMaxTimeOutUnit = 60000
    const removeUserSocket = (userSocket: Socket, userSocketId: string) => {
        //移除userSocket及其相关监听器
        userSocket.removeAllListeners('user_to_server')
        userSocket.removeAllListeners('disconnect')
        delete userNameSpace.sockets[userSocketId]
    }

    io.use((socket, next) => {
        if (isProduction && socket.handshake.xdomain)
            return socket.disconnect(true)
        next()
    })

    userNameSpace.on('connection', userSocket => {
        const userSocketId = userSocket.id
        const userInfo: IserverToKefu_userinto = JSON.parse(
            userSocket.handshake.query.userInfo
        )
        const kefu = _.minBy<IkefuInfo>(
            onlineKefus.filter(item => item.kefuIsOk),
            'sesstionNum'
        )

        if (kefu) {
            kefu.sesstionNum++
            currentConnects[userSocketId] = { kefu, extraSesstionList: [] }
            kefuNameSpace
                .to(kefu.kefuSocketId)
                .emit('server_to_kefu-userinto', userInfo)
        } else {
            awaitList[userSocketId] = { userInfo, talkList: [] }
        }

        userSocket

            .on('user_to_server', (data: IuserToServer) => {
                if (awaitList[userSocketId])
                    awaitList[userSocketId].talkList.push(data)
                else {
                    if (currentConnects[userSocketId]) {
                        const curkefu = kefu as IkefuInfo
                        if (curkefu.kefuIsOk)
                            kefuNameSpace
                                .to(curkefu.kefuSocketId)
                                .emit('server_to_kefu', data)
                        else
                            currentConnects[
                                userSocketId
                            ].extraSesstionList.push(data)
                    } else
                        userSocket.emit(
                            'server_to_user-kefudiscon',
                            '客服已经离线'
                        )
                    removeUserSocket(userSocket, userSocketId)
                }
            })

            .on('disconnect', () => {
                if (currentConnects[userSocketId]) {
                    const curkefu = kefu as IkefuInfo
                    kefuNameSpace
                        .to(curkefu.kefuSocketId)
                        .emit('server_to_kefu-userdiscon', userSocketId)
                    curkefu.sesstionNum--
                    delete currentConnects[userSocketId]
                }
                if (awaitList[userSocketId]) delete awaitList[userSocketId]
                removeUserSocket(userSocket, userSocketId)
            })
    })

    const max = 10
    const timeOut = 3 * 60000
    const spliceAwaitList = () => {
        let sesstionNum = 0
        const sendData: IserverToKefu_awaitList = {}
        for (const userSocketId in awaitList) {
            sesstionNum++
            if (sesstionNum <= max) {
                sendData[userSocketId] = awaitList[userSocketId]
                delete awaitList[userSocketId]
            } else {
                return { done: false, sendData, sesstionNum }
            }
        }
        return { done: true, sendData, sesstionNum }
    }

    kefuNameSpace
        .use((kefuSocket, next) => {
            const token: string = kefuSocket.handshake.query.token
            // vaildToken
            next()
        })
        .on('connection', kefuSocket => {
            let spliceTimer: NodeJS.Timeout
            let disconTimer: NodeJS.Timeout | unknown
            const kefu_id: string = kefuSocket.handshake.query.kefu_id
            const kefuSocketId = kefuSocket.id
            let kefu = onlineKefus.find(item => item.kefu_id === kefu_id)
            if (kefu) {
                // 重连之前的会话
                clearInterval(disconTimer as NodeJS.Timeout)
                Object.assign(kefu, {
                    kefuSocketId,
                    kefuIsOk: true,
                    timeOut: 0
                })
            } else
                kefu = {
                    kefu_id,
                    kefuSocketId,
                    sesstionNum: 0,
                    kefuIsOk: true,
                    timeOut: 0
                }

            if (_.isEmpty(awaitList)) onlineKefus.push(kefu)
            else {
                const { done, sendData, sesstionNum } = spliceAwaitList()
                kefu.sesstionNum = sesstionNum
                onlineKefus.push(kefu)
                kefuSocket.emit('server_to_kefu-awaitList', sendData)
                if (!done) {
                    spliceTimer = setInterval(() => {
                        if (!_.isEmpty(awaitList)) {
                            const {
                                done,
                                sendData,
                                sesstionNum
                            } = spliceAwaitList()
                            kefu.sesstionNum += sesstionNum
                            kefuSocket.emit(
                                'server_to_kefu-awaitList',
                                sendData
                            )
                            if (done) {
                                clearInterval(spliceTimer)
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
                .on('disconnect', () => {})
        })
}
