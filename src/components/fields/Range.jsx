import { PropTypes } from 'prop-types';
import c from 'classnames';

function Range({ 
    value, onUpdate, disabled, className, 
    max = 100, min = 0, step = 1, forceFollowStep = false,
    ...attrs 
}) {

    function correctValue(val) {
        val = +val;

        if (isNaN(val) || val < min) return min;
        if (val > max) return max;

        if (forceFollowStep && val % step) {
            val = Math.floor(val / step) * step;
        }

        return val;
    }
    
    function onRangeInput(e) {
        onUpdate(+e.target.value);
    }

    function onTextInput(e) {
        onUpdate(correctValue(e.target.value));
    }

    return (
        <div className={c('custom-field', 'range', className, {disabled})}>
            <input 
                type='range' className='slider' 
                value={value} onInput={onRangeInput} 
                max={max} min={min} step={step} 
                {...attrs} 
            />
            <input type='text' className='number' value={value} onInput={onTextInput} {...attrs} />
        </div>
    )
}

Range.propTypes = {
    value: PropTypes.string.isRequired,
    onUpdate: PropTypes.func.isRequired,
    disabled: PropTypes.bool,
    className: PropTypes.string,
    max: PropTypes.number,
    min: PropTypes.number,
    step: PropTypes.number,
    forceFollowStep: PropTypes.bool,
    options: PropTypes.array.isRequired,
}

export default Range;