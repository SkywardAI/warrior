import PropTypes from 'prop-types';
import c from "classnames";
import Markdown from 'react-markdown';
import { memo } from 'react';

function loadingAnimation() {
    return (
        <div className="loading">
            <i className="bi bi-circle-fill" />
            <i className="bi bi-circle-fill" />
            <i className="bi bi-circle-fill" />
        </div>
    )
}

function Bubble({ content, bubbleRole, className, isPendingBubble, isHidden, error }) {
    return (
        <div className={c('bubble', bubbleRole, className, { 'hidden': isHidden, error: !!error })}>
            {
                error ? 
                <div className='error-block'>
                    <div className='error-name'>{ error.name }</div>
                    <div className='error-message'>{ error.message }</div>
                </div> :
                
                (isPendingBubble && !isHidden && !content) ? loadingAnimation() : <Markdown>{content}</Markdown>
            }
        </div>
    )
}

Bubble.propTypes = {
    content: PropTypes.string.isRequired,
    bubbleRole: PropTypes.oneOf(['user', 'assistant']).isRequired,
    className: PropTypes.string,
    isPendingBubble: PropTypes.bool,
    isHidden: PropTypes.bool,
    error: PropTypes.object
}

export default memo(Bubble);