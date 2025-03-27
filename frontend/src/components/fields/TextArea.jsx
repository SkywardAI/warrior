import PropTypes from 'prop-types';
import c from 'classnames';
import { useCallback, useRef, useState } from 'react';
import { useEffect } from 'react';

function TextArea({ 
    value, onUpdate, disabled, className, focusToggle,
    autoNewLine = true, maxRows = 5, rows = 1,
    ...attrs
}) {

    const [autoRows, setRows] = useState(rows);
    const ref = useRef();

    const onInput = useCallback((e) => {
        if (disabled) return;
        onUpdate(e.target.value);
    }, [disabled, onUpdate]);

    useEffect(()=>{
        autoNewLine && setRows(Math.min(maxRows, value.split('\n').length));
    }, [value, autoNewLine, maxRows])

    useEffect(()=>{
        ref.current && !disabled && ref.current.focus();
    }, [focusToggle, disabled])

    return (
        <textarea 
            value={value} onInput={onInput} ref={ref}
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
    focusToggle: PropTypes.bool,
    autoNewLine: PropTypes.bool,
    rows: PropTypes.number,
    maxRows: PropTypes.number,
    options: PropTypes.array.isRequired,
}

export default TextArea;