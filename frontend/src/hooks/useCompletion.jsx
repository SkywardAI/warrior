import { useEffect, useState } from 'react';
import { sendMessage } from '../utils/websocket';
import { chats } from './useChats';

const components = {};
const completions = {
    all: { isFinished: true }
};

function updateAll(uuid) {
    components[uuid]?.forEach(c=>c(completions[uuid]));
}

function updateAllStatus() {
    const all_finished = Object.keys(chats).every(uuid => {
        return !completions[uuid] || completions[uuid].isFinished;
    })

    if (all_finished) {
        completions.all = { isFinished: true }
        updateAll('all');
    }
}

export function updateCompletion({ uuid, content, isFinished, error }) {
    completions[uuid] = { content, isFinished, error };
    updateAll(uuid);
    if (isFinished) {
        updateAllStatus();
        chats[uuid].history.add('assistant', content, error);
    }
}

export function startCompletion(message) {
    completions['all'] = { isFinished: false };
    updateAll('all');

    Object.values(chats).forEach((chat) => {
        chat.history.add('user', message);
    })

    sendMessage('completion', {
        chats: Object.values(chats).map((chat) => chat.value)
    })
}

export function interruptCompletion() {
    sendMessage('interrupt');
}

export default function useCompletion(uuid) {
    const [completion, setCompletion] = useState(completions[uuid]);    

    useEffect(()=>{
        if(!components[uuid]) components[uuid] = [];
        components[uuid].push(setCompletion);

        return ()=>{
            components[uuid] = components[uuid].filter(c=>c!==setCompletion);
        }
    }, [uuid])

    return completion;
}