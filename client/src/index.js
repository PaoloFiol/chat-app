import './styles/index.css';

import Router from 'preact-router';
import { h, render } from 'preact';
import { useState } from 'preact/hooks';

import Home from './components/Home';
import CreateRoom from './components/CreateRoom';
import ChatRoom from './components/ChatRoom';

function App() {
    const [state, setState] = useState({
        username: '',
        roomId: null
    });

    function setUsername(username) {
        setState(previousState => {
            const newState = { ...previousState, username };
            return newState;
        });
    }

    function setRoomId(roomId) {
        setState(previousState => {
            const newState = { ...previousState, roomId };
            return newState;
        });
    }

    return (
        <div class="max-width-3 mx-auto">
            <h1>Chat Room App</h1>
            <p>
                <a href="/create_room">Create New Room</a>
            </p>
            <Router>
                <Home
                    path="/"
                />
                <CreateRoom
                    path="/create_room" 
                    setUsername={setUsername}
                    setRoomId={setRoomId}
                />
                <ChatRoom
                    path="/:roomId"
                    state={state}
                    setUsername={setUsername}
                    setRoomId={setRoomId}
                />
            </Router>
        </div>
    );
}

render(<App />, document.getElementById('app'));