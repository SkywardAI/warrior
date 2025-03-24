import { ToastContainer } from "react-toastify";
// import Main from "./Main";
import Home from "./Home";
import { useEffect } from "react";
import { initClient } from "../hooks/useSocket";
import { loadModels } from "../hooks/useModels";

export default function App() {

    useEffect(()=>{
        initClient();
        loadModels();
    }, []);

    return (
        <>
        <Home />
        {/* <Settings /> */}
        <ToastContainer />
        </>
    )
}