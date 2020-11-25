import { h } from 'preact';
import { route } from 'preact-router';
import { useState } from 'preact/hooks';
import ChatService from '../services/ChatService';

function EnterUsernamePrompt(props) {
    const setUsername = props.setUsername;
    const roomId = props.roomId;
    const joinRoom = props.joinRoom; // a callback to trigger the room join

    const [input, setInput] = useState('');
    const [errorMessage, setErrorMessage] = useState('');

    function setGlobalUsername(input) {
        setErrorMessage('');

        ChatService.checkIfUsernameExists(input, roomId)
            .then(data => {
                if (!data.alreadyExists) {
                    const username = input.trim();
                    setUsername(username);
                    joinRoom(username);
                } else {
                    throw Error(`User ${input} already exists in this room.`);
                }
            }).catch(e => {
                setErrorMessage(e.message);
            })
        ;
    }

    return (
        <div>
            <p>Please enter your username:</p>
            <input type="text" value={input} onInput={e => setInput(e.target.value)} />
            <button onClick={() => setGlobalUsername(input)}>Join Room</button>
            {errorMessage ? <p>{errorMessage}</p> : null}
        </div>
    );
}

export default EnterUsernamePrompt;