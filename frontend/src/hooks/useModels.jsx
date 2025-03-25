import { useEffect, useState } from "react";

const reqRoute = (import.meta.env.DEV ? 
    import.meta.env.VITE_DEV_BASE_ROUTE || 'http://localhost:3000/api' :
    import.meta.env.VITE_PROD_BASE_ROUTE || '/api')
    + '/models/list'

let models = [];
const components = [];

function updateAll() {
    components.forEach((c)=>c(models));
}

let inited = false;

export async function loadModels() {
    if (inited) return true;
    inited = true;

    const resp = await fetch(reqRoute);
    if (!resp.ok) {
        console.error('failed to load models', resp);
        return;
    }

    const { models:result, error } = await resp.json();
    if (error) {
        return false;
    }

    models = result;
    updateAll();
    return true;
}

export default function useModels() {
    const [ state, setState ] = useState(models);

    useEffect(()=>{
        components.push(setState);
        return () => {
            components.splice(components.indexOf(setState), 1);
        }
    }, [setState])

    return state;
}