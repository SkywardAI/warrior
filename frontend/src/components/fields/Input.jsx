import PropTypes from 'prop-types';
import c from 'classnames';

function Input({ value, onUpdate, disabled, className, ...attrs }) {
    return (
        <input 
            value={value} onInput={e=>onUpdate(e.target.value)} disabled={disabled} 
            className={c('custom-field', 'input', className, {disabled})}
            {...attrs} 
        />
    )
}

Input.propTypes = {
    value: PropTypes.string.isRequired,
    onUpdate: PropTypes.func.isRequired,
    disabled: PropTypes.bool,
    className: PropTypes.string,
    options: PropTypes.array.isRequired,
}

export default Input;