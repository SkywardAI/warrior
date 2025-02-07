import { useEffect, useState } from "react";

const dialogs = {}
const components = {};

function updateAll(name) {
    components[name] && components[name].forEach(updater => {
        updater(dialogs[name])
    });
}

function openDialog(name) {
    dialogs[name] = true;
    updateAll(name);
}

function closeDialog(name) {
    dialogs[name] = false;
    updateAll(name);
}

function toggleDialog(name) {
    dialogs[name] = !dialogs[name];
    updateAll(name);
}

export default function useDialog(dialogName) {
    const [status, setStatus] = useState(dialogs[dialogName] || false);

    useEffect(()=>{
        components[dialogName] ??= [];
        components[dialogName].push(setStatus);
        dialogs[dialogName] ??= false;
        return () => {
            components[dialogName].splice(components[dialogName].indexOf(setStatus), 1);
        }
    // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [])

    return {
        status,
        openDialog: ()=>openDialog(dialogName),
        closeDialog: ()=>closeDialog(dialogName),
        toggleDialog: ()=>toggleDialog(dialogName)
    };
}