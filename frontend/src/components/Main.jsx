import { useState, useCallback, useEffect } from "react"
import useDialog from "../hooks/useDialog";
import ConfigModelDialog from "./ConfigModelDialog";
import { toast } from "react-toastify";
import { generateId } from "../utils/tools";
import ChatSection from "./chat/ChatSection";
import { completion, resetSession, interruptCompletion } from "../utils/bedrock-worker";
import c from 'classnames';
import TextArea from "./fields/TextArea";

function Main() {

    const [ chats, setChats ] = useState([]);
    const [ editChatId, setEditChatId ] = useState(null); 
    const [ message, setMessage ] = useState('');
    const [ allCompleteFinished, setAllCompleteFinished ] = useState(true);
    const { open:showModelDialog, close:closeModelDialog } = useDialog('select-model-dialog')

    const startEdit = useCallback((chatId) => {
        setEditChatId(chatId);
        showModelDialog();
    }, [showModelDialog]);

    const addNewChat = useCallback(() => {
        if (chats?.length >= 3) {
            toast.warning("At most 3 conversations at the same time!");
            return;
        }
        startEdit(null);
    }, [chats, startEdit])

    const resetChat = useCallback(() => {
        if (!allCompleteFinished) {
            toast.warning("Response not completed yet, please wait!");
            return;
        }
        resetSession();
        setChats(prevState=>prevState.map(e=>{
                return {
                    ...e,
                    messages: [],
                    pendingMessage: '',
                    isWaitingComplete: false
                }
            })
        )
    }, [allCompleteFinished])
    
    const deleteChat = useCallback((chatId) => {
        if (!allCompleteFinished) {
            toast.warning("Response not completed yet, please wait!");
            return;
        }
        setChats(prevState=>prevState.filter(({id})=>id!==chatId));
    }, [allCompleteFinished]);

    const finishSelectModel = useCallback((modelConfig) => {
        const newChat = {
            id: generateId(),
            modelConfig,
            messages: [],
            isWaitingComplete: false,
            pendingMessage: ''
        }
        setChats(prevState=>[...prevState, newChat]);
        closeModelDialog();
    }, [closeModelDialog]);
    
    const updateModelSettings = useCallback((chatId) => {
        return (modelConfig) => {
            setChats(prevState=>prevState.map(chat=>{
                if (chat.id === chatId) {
                    return {
                        ...chat,
                        modelConfig
                    }
                }
                return chat;
            }))
            closeModelDialog();
        }
    }, [closeModelDialog]);
    
    const sendMessage = useCallback(async () => {
        if (!allCompleteFinished) {
            toast.warning("Response not completed yet, please wait!");
            return;
        }

        if (!message) {
            toast.warning("Message cannot be empty!");
            return;
        }

        if (!chats.length) {
            toast.warning("Please select at least one model first!");
            return;
        }

        const new_chats = chats.map(chat=>{
            return {
                ...chat,
                messages: [...chat.messages, {role: 'user', content: message} ],
                pendingMessage: '',
                isWaitingComplete: true
            }
        })
        
        setAllCompleteFinished(false);
        setChats(new_chats);

        completion(new_chats.map(({id, messages, modelConfig})=>{
            return {
                messages, 
                modelConfig,
                callback: (content, isFinished, usage)=>{
                    if(!isFinished) {
                        setChats(prevState=>prevState.map(chat=>{
                            if (chat.id === id) {
                                return {
                                    ...chat,
                                    pendingMessage: content         
                                }
                            }
                            return chat;
                        }))
                    } else {
                        usage && console.log(usage);
                        setChats(prevState=>prevState.map(chat=>{
                            if (chat.id === id) {
                                return {
                                    ...chat,
                                    messages: [...chat.messages, {role: 'assistant', content}],
                                    isWaitingComplete: false,
                                    pendingMessage: ''
                                }
                            }
                            return chat;
                        }))
                    }
                }
            }
        }))
    }, [allCompleteFinished, chats, message]);

    useEffect(()=>{
        if(setAllCompleteFinished(chats.every(({isWaitingComplete})=>!isWaitingComplete)));
    }, [chats])

    const textAreaKeyDown = useCallback((event) => {
        if (event.key === 'Enter' && !event.shiftKey) {
            event.preventDefault();
            sendMessage();
            setMessage('');
        }
    }, [sendMessage, setMessage]);

    return (
        <div className="main">
            
            <div className="left-menu-bar">
                <div className="menu-item clickable" onClick={addNewChat}>Add a new chat</div>
                <div className="menu-item clickable" onClick={resetChat}>Reset chats</div>
            </div>

            <div className="chats-main">{ 
                chats.length ?

                chats.map((chat)=>{
                    return (
                        <ChatSection 
                            key={chat.id} chat={chat}
                            updateModelSettings={()=>startEdit(chat.id)}
                            deleteChat={()=>deleteChat(chat.id)}
                        />
                    )
                }) :
                
                <div className="empty-greeting">
                    <div>Please start a new chat by using the left menu bar.</div>
                    <div>At most 3 chats at the same time are supported.</div>
                </div>
            }</div>

            <div className="message-flex-container">
                <div className="message-container">
                    <TextArea 
                        value={message} onUpdate={setMessage} 
                        onKeyDown={textAreaKeyDown} maxRows={10} 
                        placeholder="Please input your message here"
                    />
                    <div
                        className="message-button clickable"
                        onClick={allCompleteFinished ? sendMessage : interruptCompletion}
                    >
                        <i className={c('bi', allCompleteFinished ? 'bi-send' : 'bi-stop-circle-fill')} />
                    </div>
                </div>
            </div>
            <ConfigModelDialog 
                updateModel={editChatId ? updateModelSettings(editChatId) : finishSelectModel}
                prefill={editChatId ? chats.find(({id})=>id===editChatId)?.modelConfig || {} : {}}
            />
        </div>
    )
}

export default Main;