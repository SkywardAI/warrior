import { PropTypes } from 'prop-types';
import { useEffect } from "react";
import { useRef } from "react"
import Bubble from './Bubble';

function Conversation({ messages, isWaitingComplete, pendingMessage }) {

    const ref = useRef();

    useEffect(()=>{
        ref.current && ref.current.scrollTo({
            top: ref.current.scrollHeight,
            behavior: 'smooth'
        })
    }, [messages, pendingMessage])

    return (
        <div className="conversation" ref={ref} >
            { messages.map(({role, content}, i)=>{
                return <Bubble key={i} bubbleRole={role} content={content} />
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
    messages: PropTypes.array.isRequired,
    isWaitingComplete: PropTypes.bool.isRequired,
    pendingMessage: PropTypes.string.isRequired
}

export default Conversation;
