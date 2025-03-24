const { listModels:listBedrockModels } = require("./bedrock-worker");

const availableModels = [];

const addModel = (modelInfo, serviceProvider) => {
    availableModels.push({ ...modelInfo, serviceProvider });
}

const queryAvailableModels = async () => {
    if (availableModels.length) return availableModels;

    (await listBedrockModels()).forEach(e=>addModel(e, 'AWS'));
    return availableModels;
}

module.exports = queryAvailableModels;