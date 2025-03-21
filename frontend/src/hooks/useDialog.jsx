import { useEffect, useState, useCallback } from "react";

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
    }, [dialogName])

    const open = useCallback(()=>{
        openDialog(dialogName);
    }, [dialogName])

    const close = useCallback(()=>{
        closeDialog(dialogName);
    }, [dialogName])

    const toggle = useCallback(()=>{
        toggleDialog(dialogName);
    }, [dialogName])

    return {
        status, open, close, toggle
    };
}