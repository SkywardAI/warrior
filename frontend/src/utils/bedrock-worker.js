import { BedrockRuntimeClient, ConverseStreamCommand } from '@aws-sdk/client-bedrock-runtime'

let bedrockRuntime = null;
let interrupt = false;

export function initClient() {
    if (bedrockRuntime) return;

    const init = {
        region: import.meta.env.VITE_AWS_REGION || 'ap-southeast-2',
    }

    if (import.meta.env.VITE_AWS_ACCESS_KEY_ID) {
        init.credentials = {
            accessKeyId: import.meta.env.VITE_AWS_ACCESS_KEY_ID,
            secretAccessKey: import.meta.env.VITE_AWS_SECRET_ACCESS_KEY,
            sessionToken: import.meta.env.VITE_AWS_SESSION_TOKEN
        }
    }

    bedrockRuntime = new BedrockRuntimeClient(init);
}

export function resetSession() {
    bedrockRuntime = null;
    initClient();
}

/**
 * @typedef ModelConfig
 * @property {string} modelId
 * @property {number} topP
 * @property {number} temperature
 * @property {number} maxTokens
 */

/**
 * @typedef Message
 * @property {'assistant'|'user'} role
 * @property {string} content
 */

/**
 * @typedef Usage
 * @property {number} inputTokens
 * @property {number} outputTokens
 * @property {number} totalTokens
 */

/**
 * @callback CompletionCallback
 * @param {string} content
 * @param {boolean} isFinished
 * @param {Usage?} usage
 */

/**
 * @typedef Chat
 * @property {ModelConfig} modelConfig
 * @property {Message[]} messages
 * @property {CompletionCallback} callback
 * @property {string?} systemPrompt
 */

/**
 * 
 * @param {ModelConfig} modelConfig 
 * @param {Message[]} messages 
 * @param {string?} systemPrompt
 * @param {CompletionCallback} callback 
 */
async function singleComplete(modelConfig, messages, systemPrompt, callback) {
    const { modelId, topP, temperature, maxTokens } = modelConfig;
    const input = {
        modelId,
        inferenceConfig: {
            topP,
            temperature,
            maxTokens,
        },
        messages: messages.map(({role, content})=>{return { role, content:[{text: content}] }})
    }

    if (systemPrompt) {
        input.system = [ { text: systemPrompt } ];
    }

    const command = new ConverseStreamCommand(input);
    const response = await bedrockRuntime.send(command);
    
    let resp_text = '', usage;
    for await (const resp of response.stream) {
        if(resp.contentBlockDelta) {
            resp_text += resp.contentBlockDelta.delta.text;
            callback && callback(resp_text, false);
        } else if(resp.metadata) {
            usage = resp.metadata.usage;
        }
        
        if(interrupt) break;
    }

    callback && callback(resp_text, true, usage);
}

/**
 * start a completion session
 * @param {Chat[]} chats 
 */
export async function completion(chats) {
    // just make sure client is inited
    initClient();
    
    interrupt = false;
    chats.forEach(({modelConfig, messages, systemPrompt, callback})=>{
        singleComplete(modelConfig, messages, systemPrompt, callback);
    })
}

export function interruptCompletion() {
    interrupt = true;
}