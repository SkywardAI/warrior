import PropTypes from 'prop-types';
import { memo, useCallback, useEffect, useRef, useState } from 'react';
import useDialog from "../hooks/useDialog"
import { MODELS } from '../utils/types';
import Range from './fields/Range';
import Select from './fields/Select';
import TextArea from './fields/TextArea';
import { addNewChat, chats, updateChat } from '../hooks/useChats';
import { toast } from 'react-toastify';

function ConfigModelDialog({ dialogName, uuid = null }) {
    const {status, close} = useDialog(dialogName);
    const ref = useRef(null);

    const [modelName, setModelName] = useState(MODELS[0].label);
    const [modelId, setModelId] = useState(MODELS[0].value);
    const [temperature, setTemperature] = useState(0.3);
    const [topP, setTopP] = useState(0.9);
    const [maxTokens, setMaxTokens] = useState(2000);
    const [systemPrompt, setSystemPrompt] = useState('');

    function submitUpdate() {
        const configuration = {
            modelName,
            modelId,
            temperature,
            topP,
            maxTokens,
            systemPrompt
        }

        if (uuid) {
            updateChat(uuid, configuration);
        } else {
            try {
                addNewChat(configuration);
            } catch(error) {
                toast.error(error.message);
            }
        }
        close();
    }

    useEffect(()=>{
        const chat = chats[uuid];
        setModelName(chat?.modelName || MODELS[0].label);
        setModelId(chat?.modelId || MODELS[0].value);
        setTemperature(chat?.temperature || 0.3);
        setTopP(chat?.topP || 0.9);
        setMaxTokens(chat?.maxTokens || 2000);
        setSystemPrompt(chat?.systemPrompt || '');
    }, [uuid])

    useEffect(()=>{
        if(ref.current) {
            if(status) ref.current.showModal();
            else ref.current.close();
        }
    }, [status])

    const updateModelName = useCallback(modelId => {
        setModelId(modelId);
        const modelName = MODELS.find(model=>model.value === modelId)?.label ?? '';
        setModelName(modelName);
    }, [])

    return (
        <dialog ref={ref} onClose={close}>
            <div className='select-model-dialog-main'>
                <div className='input-group'>
                    <div className='title'>Model Name</div>
                    <Select value={modelId} onUpdate={updateModelName} options={MODELS} />
                    <div className='title'>Temperature</div>
                    <Range value={temperature} onUpdate={setTemperature} max={1} min={0} step={0.1} />
                    <div className='title'>Top P</div>
                    <Range value={topP} onUpdate={setTopP} max={1} min={0} step={0.1} />
                    <div className='title'>Max Tokens</div>
                    <Range value={maxTokens} onUpdate={setMaxTokens} max={4000} min={128} step={1} />
                    <div className='title'>System Prompt</div>
                    <TextArea value={systemPrompt} onUpdate={setSystemPrompt} />
                </div>
                <div className='buttons'>
                    <div className='button clickable' onClick={submitUpdate}>Submit</div>
                    <div className='button clickable reverse' onClick={close}>Cancel</div>
                </div>
            </div>
        </dialog>
    )
}

ConfigModelDialog.propTypes = {
    dialogName: PropTypes.string.isRequired,
    uuid: PropTypes.string
}

export default memo(ConfigModelDialog);