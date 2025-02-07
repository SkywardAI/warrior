import { PropTypes } from 'prop-types';
import c from 'classnames';
import { useState } from 'react';

function TextArea({ 
    value, onUpdate, disabled, className, 
    autoNewLine = true, maxRows = 5, rows = 1,
    ...attrs 
}) {

    const [autoRows, setRows] = useState(rows);

    function onInput(e) {
        if (disabled) return;
        autoNewLine && setRows(Math.min(maxRows, e.target.value.split('\n').length));
        onUpdate(e.target.value);
    }

    return (
        <textarea 
            value={value} onInput={onInput}
            className={c('custom-field', 'textarea', className, {disabled})}
            rows={autoRows}
            {...attrs}
        />
    )
}

TextArea.propTypes = {
    value: PropTypes.string.isRequired,
    onUpdate: PropTypes.func.isRequired,
    disabled: PropTypes.bool,
    className: PropTypes.string,
    autoNewLine: PropTypes.bool,
    rows: PropTypes.number,
    maxRows: PropTypes.number,
    options: PropTypes.array.isRequired,
}

export default TextArea;