import { toast, ToastContainer } from "react-toastify";
// import Main from "./Main";
import Home from "./Home";
import { useEffect } from "react";
import { initClient } from "../hooks/useSocket";
import { loadModels } from "../hooks/useModels";

export default function App() {

    useEffect(()=>{
        initClient();
        loadModels().then(result=>{
            if (!result) {
                toast.error('Failed to load models, please check your credentials!');
            }
        });
    }, []);

    return (
        <>
        <Home />
        {/* <Settings /> */}
        <ToastContainer />
        </>
    )
}