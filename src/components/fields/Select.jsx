import { PropTypes } from 'prop-types';
import c from 'classnames';

function Select({ value, onUpdate, disabled, className, options, ...attrs }) {
    return (
        <select 
            value={value} onChange={e=>onUpdate(e.target.value)} 
            className={c('custom-field', 'select', className, {disabled})}
            {...attrs}
        >
            { options.map(e=>{
                let v, label;
                if (typeof e === 'string') {
                    v = e;
                    label = e;

                } else {
                    v = e.value || `${e}`;
                    label = e.label || `${e}`;
                }
                return (
                    <option key={v} value={v}>{label}</option>
                )
            }) }
        </select>
    )
}

Select.propTypes = {
    value: PropTypes.string.isRequired,
    onUpdate: PropTypes.func.isRequired,
    disabled: PropTypes.bool,
    className: PropTypes.string,
    options: PropTypes.array.isRequired,
}

export default Select;