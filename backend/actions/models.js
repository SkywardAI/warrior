const queryAvailableModels = require('../utils/models');

const listModels = async (req, res) => {
    try {
        const availableModels = await queryAvailableModels();
        res.json({models: availableModels});
    } catch (e) {
        res.status(200).json({
            error: {
                name: e.name,
                message: e.message
            }
        });
    }
}

module.exports = {
    listModels
}