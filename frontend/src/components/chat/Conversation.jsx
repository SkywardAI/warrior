import PropTypes from 'prop-types';
import { useEffect, useRef, useState } from 'react';
import Bubble from './Bubble';
import useCompletion from '../../hooks/useCompletion';

function Conversation({ chat, updateChatsToggle }) {

    const ref = useRef();

    const generalCompletionStatus = useCompletion('all');
    const currentCompletionStatus = useCompletion(chat.uuid);

    const [ isWaitingComplete, setIsWatingComplete ] = useState(false);
    const [ pendingMessage, setPendingMessage ] = useState('');

    const [ messages, setMessages ] = useState([]);
    const [ error, setError ] = useState(false);

    useEffect(() => {
        if (error) return;

        const { isFinished } = generalCompletionStatus;
        if (isWaitingComplete === isFinished) {
            setPendingMessage('');
            setMessages([...chat.messages]);
        }
        setIsWatingComplete(!isFinished);
    }, [generalCompletionStatus, isWaitingComplete, chat, error])

    useEffect(() => {
        setPendingMessage('');
        setMessages([...chat.messages]);
        setError(false);
    }, [updateChatsToggle, chat])

    useEffect(() => {
        if (currentCompletionStatus) {
            const { content, error } = currentCompletionStatus;
            if (error) {
                setError(true);
                setPendingMessage('');
                setMessages([...chat.messages]);
                setIsWatingComplete(false);
            }
            setPendingMessage(content);
        }
    }, [currentCompletionStatus, chat])

    useEffect(()=>{
        ref.current && ref.current.scrollTo({
            top: ref.current.scrollHeight,
            behavior: 'smooth'
        })
    }, [pendingMessage])

    return (
        <div className="conversation" ref={ref} >
            { messages.map(({role, content, error}, i)=>{
                return <Bubble key={i} bubbleRole={role} content={content} error={error} />
            }) }
            <Bubble 
                bubbleRole='assistant' 
                isPendingBubble={true} 
                isHidden={!isWaitingComplete} 
                content={pendingMessage} 
            />
        </div>
    )
}

Conversation.propTypes = {
    chat: PropTypes.object.isRequired,
    updateChatsToggle: PropTypes.bool.isRequired
}

export default Conversation;
