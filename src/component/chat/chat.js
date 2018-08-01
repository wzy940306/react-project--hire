import React from 'react'
import io from 'socket.io-client'
import { connect } from 'react-redux'
import { NavBar, Icon, List, InputItem, Button } from 'antd-mobile'
import { getMsgList, sendMsg, recvMsg } from '../../redux/chat.redux'
const socket = io('ws://localhost:9093')

@connect(state => state, { getMsgList, sendMsg, recvMsg })
class Chat extends React.Component {

    constructor(props) {
        super(props)
        this.state = {
            text: '',
            msg: []
        }
    }
    componentDidMount() {
        this.props.getMsgList();
        this.props.recvMsg();
    }
    onsendMsg() {
        const from = this.props.user._id;
        const to = this.props.match.params.user
        const msg = this.state.text
        this.props.sendMsg({ from, to, msg });
        this.setState({ text: '' })
    }
    render() {
        const user = this.props.match.params.user
        const Item = List.Item
        return (
            <div id='chat-box'>
                <NavBar
                    mode="dark"
                    icon={<Icon type="left" />}
                    onLeftClick={() => { this.props.history.goBack() }}

                >{user}</NavBar>

                {this.props.chat.chatmsg.map(v => {

                    return v.from === user ?
                        <List key={v._id}>
                            <Item >对方发来的{v.content}</Item>

                        </List>
                        : <List key={v._id} >
                            <Item className='chat-me'
                            extra={'avater'}
                            >我发的{v.content}</Item>
                        </List>
                })}
                <div className="stick-footer">
                    <List>
                        <InputItem placeholder='请输入'
                            value={this.state.text}
                            onChange={v => { this.setState({ text: v }) }

                            } extra={<span onClick={() => this.onsendMsg(this.state.text)}> 发送</span>}

                        >
                            信息


                        </InputItem>

                    </List>
                </div>
            </div>
        )
    }
}


export default Chat;