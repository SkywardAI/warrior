import { useEffect, useRef } from 'react';
import useDialog from "../hooks/useDialog"

export default function SelectModel() {
    const [status] = useDialog('select-model-dialog');
    const ref = useRef(null);

    useEffect(()=>{
        if(ref.current) {
            if(status) ref.current.showModal();
            else ref.current.close();
        }
    }, [status])

    return (
        <dialog ref={ref}>
            <div className='select-model-dialog-main'>
                
            </div>
        </dialog>
    )
}