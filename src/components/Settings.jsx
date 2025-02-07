import { useEffect, useRef } from 'react';
import useDialog from "../hooks/useDialog"

export default function Settings() {
    const {status} = useDialog('setting-dialog');
    const ref = useRef(null);

    useEffect(()=>{
        if(ref.current) {
            if(status) ref.current.showModal();
            else ref.current.close();
        }
    }, [status])

    return (
        <dialog ref={ref}>
            <div className='setting-dialog-main'>
                
            </div>
        </dialog>
    )
}