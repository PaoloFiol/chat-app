import { h } from 'preact';
import { route } from 'preact-router';
import { useState, useEffect, useRef } from 'preact/hooks';
import ChatService from '../services/ChatService';
import EnterUsernamePrompt from './EnterUsernamePrompt';

function ChatRoom(props) {
    // route parameters
    const roomIdParam = props.roomId;

    // props
    const state = props.state;
    const setUsername = props.setUsername;
    const setRoomId = props.setRoomId;

    // message box
    const messagesBox = useRef(null);

    const [input, setInput] = useState('');
    const [messages, setMessages] = useState([]);
    const [websocket, setWebsocket] = useState(null);
    const [roomList, setRoomList] = useState([]);
    const [userColors, setUserColors] = useState({});

    function getUserColor(username) {
        if (!(username in userColors)) {
            const newColor = getRandomColor();
            setUserColors(userColors => ({ ...userColors, [username]: newColor }));
            return newColor;
        } else {
            return userColors[username];
        }
    }

    // on Component mount, check if room exists
    useEffect(() => {
        ChatService.checkIfRoomExists(roomIdParam)
            .then(data => {
                if (!data.exists) {
                    route('/'); // room doesn't exist
                } else {
                    setRoomId(roomIdParam);

                    if (state.username) {
                        // if the username is already set, go ahead and join room
                        joinRoom(state.username);
                    }
                }
            })
            .catch(e => {
                console.error(e);
                route('/');
            });
    }, []);

    // this big function joins the room and establishes the websocket connection
    function joinRoom(username) {
        ChatService.joinRoom(username, roomIdParam) // this asks the server to join the room
            .then(data => {
                if (!data.roomId) {
                    route('/');
                } else {
                    setWebsocket(websocket => {
                        websocket = ChatService.createWebSocket({ username: username, roomId: data.roomId });

                        websocket.onmessage = function(ev) {
                            let msgData = JSON.parse(ev.data);

                            if (msgData.type === 'roomList' && msgData.roomId === data.roomId) {
                                const newRoomList = msgData.message;
                                setRoomList([...newRoomList]);
                            } else if (msgData && msgData.roomId === data.roomId && msgData.message.trim().length > 0) {
                                setMessages(messages => [...messages, msgData]);
                                setInput('');
                            }

                            // scroll to the bottom of the messages box
                            if (messagesBox.current) {
                                setTimeout(function() {
                                    messagesBox.current.scrollTop = messagesBox.current.scrollHeight;
                                });
                            }
                        };

                        return websocket;
                    });
                }
            })
            .catch(e => {
                console.error('could not join room', e);
            })
        ;
    }

    // this function gets triggered when a user clicks the 'send' button
    function onSend() {
        // if the input is not empty
        if (input.trim()) {
            // encode the new message data as JSON first
            const json = JSON.stringify({ username: state.username, roomId: state.roomId, message: input });

            // send it to the server via websocket
            websocket.send(json);
        }
    }

    // The bottom if-conditional shows what renders depending on what variables are set
    if (state.username && state.roomId && websocket) {
        return (
            <div>
                <div ref={messagesBox} id="messages">
                    {messages.map(msgData =>
                        <p style="margin-bottom: 0.5rem;">
                            {msgData.type === 'serverMessage'
                                ? <em>{msgData.message}</em>
                                : (
                                    <span>
                                        <span style={{color: getUserColor(msgData.username), fontWeight: 600}}>
                                            {msgData.username}: 
                                        </span>
                                            &nbsp;{msgData.message}
                                    </span>
                                )
                            }
                            
                        </p>
                    )}
                </div>

                <input
                    type="text"
                    maxlength="300"
                    id="message-input"
                    value={input}
                    onInput={e => setInput(e.target.value)}
                    onKeyPress={e => e.keyCode == 13 ? onSend() : null}
                />

                <button onClick={onSend}>
                    send
                </button>

                <div>
                    <h6>Users connected:</h6>
                    <ul>
                        {roomList.map(user =>
                            <li>{user}</li>
                        )}
                    </ul>
                </div>
            </div>
        )
    } else if (!state.username && state.roomId) {
        return (
            <div>
                <EnterUsernamePrompt
                    setUsername={setUsername}
                    roomId={roomIdParam}
                    joinRoom={joinRoom} // EnterUsernamePrompt calls this function once username is set
                />
            </div>
        );
    }
}

function getRandomColor() {
    const chars = '0123456789ABCDEF';
    let color = '#';

    for (let i = 0; i < 6; i++) {
        color += chars[Math.floor(Math.random() * 16)];
    }

    return color;
}

export default ChatRoom;