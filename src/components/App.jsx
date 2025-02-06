import { ToastContainer } from "react-toastify";
import Main from "./Main";
import SelectModel from "./SelectModel";
import Settings from "./Settings";

export default function App() {
    return (
        <>
        <Main />
        <SelectModel />
        <Settings />
        <ToastContainer />
        </>
    )
}