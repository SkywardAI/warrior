import { PropTypes } from 'prop-types';
import { useEffect, useRef } from 'react';
import useDialog from "../hooks/useDialog"
import { useState } from 'react';
import Range from './fields/Range';
import Select from './fields/Select';
import { MODELS } from '../utils/types';
import TextArea from './fields/TextArea';

function SelectModel({ updateModel, prefill }) {
    const {status, closeDialog} = useDialog('select-model-dialog');
    const ref = useRef(null);

    const [modelName, setModelName] = useState(MODELS[0].label);
    const [modelId, setModelId] = useState(MODELS[0].value);
    const [temperature, setTemperature] = useState(0.3);
    const [topP, setTopP] = useState(0.9);
    const [maxTokens, setMaxTokens] = useState(2000);
    const [systemPrompt, setSystemPrompt] = useState('');

    function submitUpdate() {
        updateModel({
            modelName,
            modelId,
            temperature,
            topP,
            maxTokens,
            systemPrompt
        });
    }

    useEffect(()=>{
        setModelName(prefill?.modelName ?? MODELS[0].label);
        setModelId(prefill?.modelId ?? MODELS[0].value);
        setTemperature(prefill?.temperature ?? 0.3);
        setTopP(prefill?.topP ?? 0.9);
        setMaxTokens(prefill?.maxTokens ?? 2000);
        setSystemPrompt(prefill?.systemPrompt ?? '');
    }, [prefill])

    useEffect(()=>{
        if(ref.current) {
            if(status) ref.current.showModal();
            else ref.current.close();
        }
    }, [status])

    function updateModelName(modelId) {
        setModelId(modelId);
        const modelName = MODELS.find(model=>model.value === modelId)?.label ?? '';
        setModelName(modelName);
    }

    return (
        <dialog ref={ref} onClose={closeDialog}>
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
                    <div className='button' onClick={submitUpdate}>Submit</div>
                    <div className='button' onClick={closeDialog}>Cancel</div>
                </div>
            </div>
        </dialog>
    )
}

SelectModel.propTypes = {
    updateModel: PropTypes.func.isRequired,
    prefill: PropTypes.object
}

export default SelectModel;