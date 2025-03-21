import { updateCompletion } from "./useCompletion";

const MAX_RETRY = import.meta.env.VITE_MAX_WEBSOCKET_RETRY || -1;
const RETRY_INTERVAL = import.meta.env.VITE_WEBSOCKET_RETRY_INTERVAL || 100;
const WS_ROUTE = import.meta.env.DEV ? 
    import.meta.env.VITE_WS_DEV_ROUTE || 'ws://localhost:3000/api/ws' : 
    import.meta.env.VITE_WS_PROD_ROUTE || '/api/ws';

let wsClient;
let retryCount = 0;


export function sendMessage(action, data) {
    if (!wsClient || wsClient.readyState !== WebSocket.OPEN) return;
    
    if (!data) {
        data = {}
    } else if (typeof data !== 'object') {
        data = {data}
    }

    wsClient.send(JSON.stringify({
        action,
        ...data
    }));
}

export function closeWsClient() {
    if (!wsClient || wsClient.readyState === WebSocket.CONNECTING) return;
    wsClient.close();
    wsClient = null;
}

function handleActions(action, data) {
    switch(action) {
        case 'completion':
            updateCompletion(data);
            break;
    }
}

export function initClient() {
    if (!wsClient) {
        wsClient = new WebSocket(WS_ROUTE);
    } else {
        return;
    }


    wsClient.onopen = () => {
        console.log('ws opened');
        retryCount = 0;
    }

    wsClient.onmessage = (event) => {
        const {action, ...data} = JSON.parse(event.data);
        handleActions(action, data);
    }

    wsClient.onclose = () => {
        console.log('ws closed');
        closeWsClient();
    }

    wsClient.onerror = (error) => {
        console.log('ws error', error);
        closeWsClient();
        if (MAX_RETRY === -1 || ++retryCount <= MAX_RETRY) {
            setTimeout(initClient, RETRY_INTERVAL);
        }
    }
}