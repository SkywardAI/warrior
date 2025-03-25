const queryAvailableModels = require('../utils/models');

const listModels = async (req, res) => {
    try {
        const availableModels = await queryAvailableModels();
        res.json({models: availableModels});
    } catch (e) {
        console.error(e);
        res.status(500).json({error: e.message});
    }
}

module.exports = {
    listModels
}