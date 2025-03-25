const { BedrockClient, ListFoundationModelsCommand } = require('@aws-sdk/client-bedrock');
const { BedrockRuntimeClient, ConverseStreamCommand } = require('@aws-sdk/client-bedrock-runtime');

let bedrockRuntime = null;
let interrupt = false;

let availableModels = null;

const getInit = () => {
    const init = {};

    const region = process.env.AWS_REGION || '';
    const accessKeyId = process.env.AWS_ACCESS_KEY_ID || '';
    const secretAccessKey = process.env.AWS_SECRET_ACCESS_KEY || '';
    const sessionToken = process.env.AWS_SESSION_TOKEN || '';

    if (region) {
        init.region = region;
    }

    if (accessKeyId && secretAccessKey) {
        init.credentials = {
            accessKeyId,
            secretAccessKey,
        }
        if (sessionToken) {
            init.credentials.sessionToken = sessionToken;
        }
    }

    return init;
}

const listModels = async () => {
    try {
        if (availableModels) return availableModels;

        const bedrock = new BedrockClient(getInit());
        const { modelSummaries } = await bedrock.send(new ListFoundationModelsCommand());
        availableModels = modelSummaries
            .filter(model=> model.outputModalities.includes('TEXT'))
            .map(({ modelId, modelName, providerName, inputModalities }) => {
                const supportImage = inputModalities.includes('IMAGE');
                return { modelId, modelName, providerName, supportImage } 
            });
        return availableModels;
    } catch (error) {
        throw error;
    }
}


const initClient = () => {
    if (bedrockRuntime) return;
    bedrockRuntime = new BedrockRuntimeClient(getInit());
}

const resetSession = () => {
    bedrockRuntime = null;
    initClient();
}

/**
 * @callback CompletionCallback
 * @param {string} content
 * @param {boolean} isFinished
 * @param {Usage?} usage
 */

/**
 * @param {CompletionCallback} callback 
 */
singleComplete = async ({modelId, systemPrompt, history, inferenceConfig}, callback) => {
    const input = {
        modelId,
        inferenceConfig,
        messages: history.map(({role, content})=>{return { role, content:[{text: content}] }})
    }

    if (systemPrompt) {
        input.system = [ { text: systemPrompt } ];
    }

    const command = new ConverseStreamCommand(input);

    let content = '', usage;
    try {
        const response = await bedrockRuntime.send(command);
        
        for await (const resp of response.stream) {
            if(resp.contentBlockDelta) {
                content += resp.contentBlockDelta.delta.text;
                callback && callback({ content, isFinished: false });
            } else if(resp.metadata) {
                usage = resp.metadata.usage;
            }
            
            if(interrupt) break;
        }
    
        callback && callback({ content, isFinished: true, usage });
    } catch(error) {
        callback({ error: {name: error.name, message: error.message}, content, isFinished: true });
    }
}

/**
 * start a completion session
 * @param {Chat[]} chats 
 */
const completion = async (chats, callback) => {
    // just make sure client is inited
    initClient();
    
    interrupt = false;
    chats.forEach((chat)=>{
        singleComplete(chat, callback(chat.uuid));
    })
}

const interruptCompletion = () => {
    interrupt = true;
}

module.exports = {
    completion,
    interruptCompletion,
    resetSession,
    listModels
}