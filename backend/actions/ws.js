// ===========================================
// CLIENTS
// ===========================================
const { completion } = require("../utils/bedrock-worker");
const clients = [];

function sendToClient(client, action, messages) {
    if (typeof messages === 'string') {
        messages = { message: messages };
    }
    
    client.send(JSON.stringify({
        action,
        ...messages
    }));
}

function sendToAllClients(action, messages) {
    clients.forEach(client=>sendToClient(client, action, messages));
}

// ===========================================
// SEND FROM SERVER
// ===========================================
const sendCompletion = (uuid) => {
    return function({content, isFinished, usage = null, error = null}) {
        sendToAllClients('completion', { uuid, content, error, isFinished, usage });
    }
}

// ===========================================
// ACTIONS
// ===========================================
const completionAction = ({chats}) => {
    completion(chats, sendCompletion);
}


function handleActions(client, action, data) {
    switch(action) {
        case 'completion':
            completionAction(data);
            break;
    }
}

// ===========================================
// EXPORTS
// ===========================================
const wsHandler = (client) => {

    clients.push(client);

    const closeWs = () => {
        client.close();
        clients.splice(clients.indexOf(client), 1);
    };
    
    client.on('message', (message) => {
        const { action, ...data } = JSON.parse(message);
        handleActions(client, action, data);
    });
    client.on('error', (message) => {
        console.error(message);
        closeWs();
    });
    client.on('close', closeWs);
}

module.exports = {
    wsHandler, sendToAllClients
}