import { ToastContainer } from "react-toastify";
// import Main from "./Main";
import Home from "./Home";
import { useEffect } from "react";
import { initClient } from "../hooks/useSocket";

export default function App() {

    useEffect(initClient, []);

    return (
        <>
        <Home />
        {/* <Settings /> */}
        <ToastContainer />
        </>
    )
}