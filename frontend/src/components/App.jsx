import { toast, ToastContainer } from "react-toastify";
// import Main from "./Main";
import Home from "./Home";
import { useEffect } from "react";
import { initClient } from "../utils/websocket";
import { loadModels } from "../hooks/useModels";

export default function App() {

    useEffect(()=>{
        initClient();
        loadModels().then(error=>{
            if (error) {
                console.log(error);
                toast.error(`Failed to load model: ${error.name}: ${error.message}`);
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