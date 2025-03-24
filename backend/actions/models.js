const queryAvailableModels = require('../utils/models');

const listModels = async (req, res) => {
    const availableModels = await queryAvailableModels();
    res.json(availableModels);
}

module.exports = {
    listModels
}