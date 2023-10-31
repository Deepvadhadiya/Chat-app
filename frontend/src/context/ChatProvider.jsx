// Import necessary modules
import React, { createContext, useContext, useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";

// Create and export the ChatContext
export const ChatContext = createContext();

// Create the ChatProvider component
const ChatProvider = ({ children }) => {
    const [user, setUser] = useState();
    const [selectedChat, setSelectedChat] = useState();
    const [chats, setChats] = useState([]);
    const [notification, setNotification] = useState([]);

    const navigate = useNavigate();

    useEffect(() => {
        const userInfo = JSON.parse(localStorage.getItem("userInfo"));
        setUser(userInfo);

        if (!userInfo) {
            // You can use navigate here
            navigate('/');
        }
    }, [navigate]);

    return (
        <ChatContext.Provider value={{
            user, setUser, selectedChat, setSelectedChat, chats, setChats, notification, setNotification
        }}>
            {children}
        </ChatContext.Provider>
    );
};

// Export ChatState along with other components
export const ChatState = () => {
    return useContext(ChatContext);
};


export default ChatProvider;