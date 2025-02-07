import { PropTypes } from 'prop-types';
import c from "classnames";
import Markdown from 'react-markdown';

function loadingAnimation() {
    return (
        <div className="loading">
            <i className="bi bi-circle-fill" />
            <i className="bi bi-circle-fill" />
            <i className="bi bi-circle-fill" />
        </div>
    )
}

function Bubble({ content, bubbleRole, className, isPendingBubble, isHidden }) {
    return (
        <div className={c('bubble', bubbleRole, className, { 'hidden': isHidden })}>
            { (isPendingBubble && !isHidden && !content) ? loadingAnimation() : <Markdown>{content}</Markdown> }
        </div>
    )
}

Bubble.propTypes = {
    content: PropTypes.string.isRequired,
    bubbleRole: PropTypes.oneOf(['user', 'assistant']).isRequired,
    className: PropTypes.string,
    isPendingBubble: PropTypes.bool,
    isHidden: PropTypes.bool
}

export default Bubble;