import { useCallback, useEffect, useState } from "react";
import useChats, { resetChat } from "../hooks/useChats";
import useDialog from "../hooks/useDialog";
import ChatSection from "./chat/ChatSection";
import ConfigModelDialog from "./ConfigModelDialog";
import MessageBox from "./MessageBox";
import useCompletion, { resetCompletion } from "../hooks/useCompletion";
import { toast } from "react-toastify";


function Home() {
    const chats = useChats();

    const [ editChatUUID, setEditChatUUID ] = useState(null);
    const [ updateChatsToggle, setUpdateChatsToggle ] = useState(true);
    const generalCompletionStatus = useCompletion('all');

    const { open:openEditModelDialog } = useDialog('edit-model-dialog');

    useEffect(()=>{
        setUpdateChatsToggle(prev=>!prev);
    }, [chats])

    const startEditModel = useCallback((uuid) => {
        setEditChatUUID(uuid);
        openEditModelDialog();
    }, [openEditModelDialog]);

    const resetAllChats = () => {
        if (generalCompletionStatus.isFinished) {
            resetCompletion();
            resetChat();
        } else {
            toast.warn("Please wait for all completions to finish!");
        }
    }

    return (
        <div className="main">
            <div className="left-menu-bar">
                <div className="menu-item clickable" onClick={()=>startEditModel(null)}>Add a new chat</div>
                <div className="menu-item clickable" onClick={resetAllChats}>Reset chats</div>
            </div>

            <div className="chats-main">
                {
                    chats && Object.keys(chats).length ?

                    Object.values(chats).map(chat => {
                        const uuid = chat.uuid;
                        return <ChatSection
                            key={uuid}
                            chat={chat}
                            updateModelSettings={()=>startEditModel(uuid)}
                            updateChatsToggle={updateChatsToggle}
                        />
                    }) :

                    <div className="empty-greeting">
                        <div>Please start a new chat by using the left menu bar.</div>
                        <div>At most 3 chats at the same time are supported.</div>
                    </div>
                }
            </div>
            <MessageBox />
            <ConfigModelDialog dialogName='edit-model-dialog' uuid={editChatUUID} />
        </div>
    )
}

export default Home;