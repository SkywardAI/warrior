/**
 * @typedef Configuration
 * @property {string} modelId
 * @property {string} modelName
 * @property {number} temperature
 * @property {number} topP
 * @property {number} maxTokens
 * @property {string} systemPrompt 
 */

import { useState, useEffect } from "react";

class History {
    constructor(pastHistory = null) {
        this.history = pastHistory ?? [];
        this.hasError = false;
    }

    add(role, content, error = null) {
        if (this.hasError) return;
        if (error) this.hasError = true;

        this.history.push({ role, content, error });
    }

    reset() {
        this.history.length = 0;
        this.hasError = false;
    }
}

class Chat {
    /**
     * @param {Configuration} configurations 
     */
    constructor(configurations) {
        this.uuid = crypto.randomUUID();
        this.history = new History();

        this._setConfigurations(configurations);
    }

    /**
     * @param {Configuration} configurations 
     */
    _setConfigurations(configurations) {
        const {
            modelId = this.modelId,
            modelName = this.modelName,
            temperature = this.temperature,
            topP = this.topP,
            maxTokens = this.maxTokens,
            systemPrompt = this.systemPrompt
        } = configurations;

        this.modelId = modelId;
        this.modelName = modelName;
        this.temperature = temperature;
        this.topP = topP;
        this.maxTokens = maxTokens;
        this.systemPrompt = systemPrompt;
        this.inferenceConfig = {
            temperature: this.temperature,
            topP: this.topP,
            maxTokens: this.maxTokens
        }
    }

    /**
     * @param {Configuration} configurations 
     */
    updateConfiguration(configurations) {
        this._setConfigurations(configurations);
    }

    get messages() {
        return this.history.history;
    }

    get value() {
        return {
            uuid: this.uuid,
            modelId: this.modelId,
            systemPrompt: this.systemPrompt,
            history: this.history.history,
            inferenceConfig: this.inferenceConfig
        }
    }

    get hasError() {
        return this.history.hasError;
    }
}

const components = [];
export let chats = {};

function updateAll() {
    chats = { ...chats };
    components.forEach((component) => {
        component(chats);
    })
}

/**
 * @param {Configuration} config 
 */
export function addNewChat(config) {
    if (Object.keys(chats).length >= 3) {
        throw new Error('Maximum number of chats reached');
    }
    const chat = new Chat(config);
    chats[chat.uuid] = chat;
    updateAll();
}

/**
 * @param {Configuration} config 
 */
export function removeChat(uuid) {
    if (!chats[uuid]) {
        return false;
    }
    delete chats[uuid];
    updateAll();
    return true;
}

/**
 * @param {string} uuid 
 * @param {Configuration} config 
 */
export function updateChat(uuid, config) {
    if (!chats[uuid]) {
        return false;
    }
    chats[uuid].updateConfiguration(config);
    updateAll();
    return true;
}

export function resetChat() {
    Object.values(chats).forEach((chat) => {
        chat.history.reset();
    })
    updateAll();
}

export default function useChats() {
    const [state, setState] = useState(chats);

    useEffect(() => {
        components.push(setState);
        return () => {
            const index = components.indexOf(setState);
            components.splice(index, 1);
        }
    }, []);

    return state;
}