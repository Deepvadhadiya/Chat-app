import React, { useState } from 'react'
import { ChatState } from '../context/ChatProvider'
import { Box } from '@chakra-ui/react';
import SideDrawer from '../components/miscellaneous/SideDrawer.jsx';
import MyChats from './../components/MyChats.jsx';
import ChatBox from './../components/ChatBox.jsx';

const ChatPage = () => {
    const { user } = ChatState();
    const [fetchAgain, setFetchAgain] = useState();
    return (
        <div style={{ width: "100%" }}>
            {user && <SideDrawer />}
            <Box style={{ display: "flex", justifyContent: "space-between" }} w="100%" h="91.5vh" p="10px">
                {user && (
                    <MyChats fetchAgain={fetchAgain} />
                )}
                {user && (
                    <ChatBox fetchAgain={fetchAgain} setFetchAgain={setFetchAgain} />
                )}
            </Box>
        </div>
    )
}

export default ChatPage
