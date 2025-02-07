import { PropTypes } from 'prop-types'
import Conversation from './Conversation';
function ChatSection({ chat, updateModelSettings, deleteChat }) {
    return (
        <div className="chat-section">
            <div className="chat-config">
                <div className='title'>{chat.modelConfig.modelName}</div>
                <i className='bi bi-pencil clickable' onClick={updateModelSettings} />
                <i className='bi bi-trash clickable' onClick={deleteChat} />
            </div>
            <Conversation {...chat} />
        </div>
    )

}

ChatSection.propTypes = {
    chat: PropTypes.object.isRequired,
    updateModelSettings: PropTypes.func.isRequired,
    deleteChat: PropTypes.func.isRequired
}

export default ChatSection;