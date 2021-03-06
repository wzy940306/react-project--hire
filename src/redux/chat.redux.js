import axios from 'axios'
import io from 'socket.io-client'

const socket = io('ws://localhost:9093')

const MSG_LIST = 'MSG_LIST'
const MSG_RECV = 'MSG_RECV'
const MSG_READ = 'MSG_READ'

const initState = {

    chatmsg: [],
    unread: 0
}

export function chat(state = initState, action) {
    switch (action.type) {
        case MSG_LIST:
            return { ...state, chatmsg: action.payload, unread: action.payload.filter(v => !v.read).length }
        case MSG_RECV:
           return  {...state,chatmsg:[...state.chatmsg,action.payload],unread:state.unread+1}
        case MSG_READ:
        default:
            return state
    }

}
export function msgList(msgs) {
    return {
        type: MSG_LIST,
        payload: msgs
    }
}
export function sendMsg({ from, to, msg }) {
    return dispatch => {
        socket.emit("sendMsg", { from, to, msg })

    }
}
export function recvMsg() {
    return dispatch => {
        socket.on("recvMsg",function(data){
            console.log("recvMsg")
            dispatch(msgRecv(data))
        })

    }
}
export function getMsgList() {

    return (dispatch, getState) => {
        axios.get('/user/chatMsgList').then(
            res => {
                console.log(getState())
                if (res.status === 200 && res.data.code === 0) {
                    dispatch(msgList(res.data.msgs))
                }
            }
        )
    }
}
function msgRecv(data){
    return {
        type:MSG_RECV,
        payload:data
    }
}