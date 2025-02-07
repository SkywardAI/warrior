import { useState } from "react"
import useDialog from "../hooks/useDialog";
import SelectModel from "./SelectModel";
import { toast } from "react-toastify";
import { generateId } from "../utils/tools";
import ChatSection from "./chat/ChatSection";
import { completion, resetSession, interruptCompletion } from "../utils/bedrock-worker";
import { useEffect } from "react";
import c from 'classnames';
import TextArea from "./fields/TextArea";

export default function Main() {

    const [ chats, setChats ] = useState([]);
    const [ editChatId, setEditChatId ] = useState(null); 
    const [ message, setMessage ] = useState('');
    const [ allCompleteFinished, setAllCompleteFinished ] = useState(true);
    const { openDialog:showModelDialog, closeDialog:closeModelDialog } = useDialog('select-model-dialog')

    function addNewChat() {
        if (chats.length >= 3) {
            toast.warning("At most 3 conversations at the same time!");
            return;
        }
        startEdit(null);
    }

    function resetChat() {
        if (!allCompleteFinished) {
            toast.warning("Response not completed yet, please wait!");
            return;
        }
        resetSession();
    }

    function deleteChat(chatId) {
        if (!allCompleteFinished) {
            toast.warning("Response not completed yet, please wait!");
            return;
        }
        setChats(prevState=>prevState.filter(({id})=>id!==chatId));
    }

    function finishSelectModel(modelConfig) {
        const newChat = {
            id: generateId(),
            modelConfig,
            messages: [],
            isWaitingComplete: false,
            pendingMessage: ''
        }
        setChats(prevState=>[...prevState, newChat]);
        closeModelDialog();
    }

    function startEdit(chatId) {
        setEditChatId(chatId);
        showModelDialog();
    }

    function updateModelSettings(chatId) {
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
    }

    async function sendMessage() {
        if (!allCompleteFinished) {
            toast.warning("Response not completed yet, please wait!");
            return;
        }

        if (!message) {
            toast.warning("Message cannot be empty!");
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
    }

    useEffect(()=>{
        if(setAllCompleteFinished(chats.every(({isWaitingComplete})=>!isWaitingComplete)));
    }, [chats])

    function textAreaKeyDown(event) {
        if (event.key === 'Enter' && !event.shiftKey) {
            event.preventDefault();
            sendMessage();
            setMessage('');
        }
    }

    return (
        <div className="main">
            <div className="clickable" onClick={addNewChat}>click to add new chat</div>

            <div>{ chats.map((chat)=>{
                return (
                    <ChatSection 
                        key={chat.id} chat={chat}
                        updateModelSettings={()=>startEdit(chat.id)}
                    />
                )
            }) }</div>

            <div className="message-container">
                <TextArea value={message} onUpdate={setMessage} onKeyDown={textAreaKeyDown}/>
                <div
                    className="message-button clickable"
                    onClick={allCompleteFinished ? sendMessage : interruptCompletion}
                >
                    <i className={c('bi', allCompleteFinished ? 'bi-send' : 'bi-stop-circle-fill')} />
                </div>
            </div>
            <SelectModel 
                updateModel={editChatId ? updateModelSettings(editChatId) : finishSelectModel}
                prefill={editChatId ? chats.find(({id})=>id===editChatId)?.modelConfig || {} : {}}
            />
        </div>
    )
}