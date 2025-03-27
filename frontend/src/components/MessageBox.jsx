import PropTypes from "prop-types";
import { memo, useEffect, useState } from "react";
import TextArea from "./fields/TextArea";
import c from 'classnames';
import useCompletion, { interruptCompletion, startCompletion } from "../hooks/useCompletion";

function MessageBox({ disabled, focusToggle }) {
    const [ message, setMessage ] = useState('');
    const [ allCompletionFinished, setAllCompletionFinished ] = useState(true);
    const generalCompletionStatus = useCompletion('all');

    useEffect(()=>{
        setAllCompletionFinished(generalCompletionStatus.isFinished);
    }, [generalCompletionStatus])

    const submitMessage = () =>{
        if (!message.trim()) return;
        startCompletion(message);
        setMessage('');
    }

    const textAreaKeyDown = (event) => {
        if (event.key === 'Enter' && !event.shiftKey) {
            submitMessage();
            event.preventDefault();
        }
    }

    return (
        <div className="message-flex-container">
            <div className="message-container">
                <TextArea 
                    value={message} onUpdate={setMessage} 
                    onKeyDown={textAreaKeyDown} maxRows={10} 
                    placeholder={disabled ? "Please add a chat section first" : "Please input your message here"}
                    disabled={disabled} focusToggle={focusToggle}
                />
                <div
                    className={c("message-button clickable", { hidden: disabled })}
                    onClick={allCompletionFinished ? submitMessage : interruptCompletion}
                >
                    <i className={c('bi', allCompletionFinished ? 'bi-send' : 'bi-stop-circle-fill')} />
                </div>
            </div>
        </div>
    )
}

MessageBox.propTypes = {
    disabled: PropTypes.bool,
    focusToggle: PropTypes.bool
}

export default memo(MessageBox);