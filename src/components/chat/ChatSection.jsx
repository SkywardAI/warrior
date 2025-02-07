import { PropTypes } from 'prop-types'
import Conversation from './Conversation';
function ChatSection({ chat, updateModelSettings }) {
    return (
        <div className="chat-section">
            <div className="chat-config" onClick={updateModelSettings}>
                <div className='title'>{chat.modelConfig.modelName}</div>
                <i className='bi bi-pencil' />
            </div>
            <Conversation {...chat} />
        </div>
    )

}

ChatSection.propTypes = {
    chat: PropTypes.object.isRequired,
    updateModelSettings: PropTypes.func.isRequired
}

export default ChatSection;