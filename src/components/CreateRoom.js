import { h } from 'preact';
import { route } from 'preact-router';
import { useState } from 'preact/hooks';
import ChatService from '../services/ChatService';

function CreateRoom(props) {
    // props
    const serverInfo = props.serverInfo;
    const setUsername = props.setUsername;
    const setRoomId = props.setRoomId;

    // state used for name input
    const [input, setInput] = useState('');

    // helper function to set the name from the user input
    function updateInput(event) {
        const value = event.target.value;
        setInput(value);
    }

    // creates the room on the server, updates the client state
    function createRoom(input) {
        ChatService.createRoom(input)
            .then(data => {
                setUsername(data.username);

                // route to newly created room
                route('/' + data.roomId);
            })
        ;
    }

    return (
        <div>
            <p>Create a Room:</p>
            <p>Please enter your username:</p>
            <input type="text" value={input} onInput={updateInput} />

            <button
                onClick={() => createRoom(input)}
                disabled={input.trim().length < 1}
            >
                Create Room
            </button>
        </div>
    );
}

export default CreateRoom;