import { createStore } from 'vuex'
import { IsingleMsg } from 'MyType'

interface IsessionItem {
    type: 'static' | 'dynamic'
    contentType?: 'plain' | 'complex'
    componentName?: 'string'
    content?: IsingleMsg
}

export default createStore<{
    sessions: IsessionItem[]
    curSessionType: 'static' | 'dynamic' | 'all'
}>({
    state: {
        sessions: [],
        curSessionType: 'all'
    },

    mutations: {
        pushSession: ({ sessions }, session: IsessionItem) =>
            sessions.push(session),
        toggleCurSessionType: (state, type: 'static' | 'dynamic' | 'all') =>
            (state.curSessionType = type)
    },

    getters: {
        curSessions: ({ sessions, curSessionType }) =>
            curSessionType === 'all'
                ? sessions
                : sessions.filter(item => item.type === curSessionType)
    }
})
