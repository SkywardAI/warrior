import PropTypes from 'prop-types'
import Conversation from './Conversation';
import { removeChat } from '../../hooks/useChats';

function ChatSection({ chat, updateModelSettings, updateChatsToggle }) {
    return (
        <div className="chat-section">
            <div className="chat-config">
                <div className='title'>{chat.modelName}</div>
                <i className='bi bi-pencil clickable' onClick={updateModelSettings} />
                <i className='bi bi-trash clickable' onClick={()=>removeChat(chat?.uuid)} />
            </div>
            <Conversation chat={chat} updateChatsToggle={updateChatsToggle} />
        </div>
    )

}

ChatSection.propTypes = {
    chat: PropTypes.object.isRequired,
    updateModelSettings: PropTypes.func.isRequired,
    updateChatsToggle: PropTypes.bool.isRequired
}

export default ChatSection;