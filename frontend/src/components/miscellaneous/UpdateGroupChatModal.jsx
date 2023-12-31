import { ViewIcon } from '@chakra-ui/icons'
import { Box, Button, FormControl, IconButton, Input, Modal, ModalBody, ModalCloseButton, ModalContent, ModalFooter, ModalHeader, ModalOverlay, Spinner, useDisclosure, useToast } from '@chakra-ui/react'
import React, { useState } from 'react'
import { ChatState } from '../../context/ChatProvider.jsx';
import UserBadgeItem from '../userAvatar/UserBadgeItem';
import axios from 'axios';
import UserList from '../userAvatar/UserList.jsx';

const UpdateGroupChatModal = ({ fetchAgain, setFetchAgain, fetchMessages }) => {

    const { isOpen, onOpen, onClose } = useDisclosure();

    const [groupChatName, setGroupChatName] = useState();
    const [search, setSearch] = useState("");
    const [searchResult, setSearchResult] = useState([]);
    const [loading, setLoading] = useState(false);
    const [renameLoading, setRenameLoading] = useState(false);

    const toast = useToast();

    const { selectedChat, setSelectedChat, user } = ChatState();

    const handleAddUser = async (user1) => {
        if (selectedChat.users.find((u) => u._id === user1._id)) {
            toast({
                title: "User Already in Group!",
                status: "error",
                duration: 2000,
                position: "bottom",
                isClosable: true,
            });
            return;
        }

        if (selectedChat.groupAdmin._id !== user._id) {
            toast({
                title: "Only admins can add someone!",
                status: "error",
                duration: 2000,
                position: "bottom",
                isClosable: true,
            });
            return;
        }

        try {
            setLoading(true);
            const config = {
                headers:
                {
                    Authorization: `Bearer ${user.token}`
                },
            };

            const { data } = await axios.put('/api/chat/groupadd', {
                chatId: selectedChat._id,
                userId: user1._id,
            },
                config
            );

            setSelectedChat(data);
            toast({
                title: `${user1.name} added successfully by ${user.name}`,
                status: 'success',
                duration: 2000,
                position: 'top-right',
                isClosable: true,
            });
            setFetchAgain(!fetchAgain);
            setLoading(false);

        } catch (error) {
            toast({
                title: 'Error Occured!',
                description: error?.response?.data?.message,
                status: 'error',
                duration: 2000,
                isClosable: true,
                position: "bottom",
            });
            setLoading(false);
        }
    };

    const handleRemove = async (user1) => {
        if (selectedChat.groupAdmin._id !== user._id && user1._id !== user._id) {
            toast({
                title: "Only admins can Remove Someone!",
                status: "error",
                duration: 2000,
                position: "bottom",
                isClosable: true,
            });
            return;
        }

        try {
            setLoading(true);
            const config = {
                headers: {
                    Authorization: `Bearer ${user.token}`,
                },
            };
            const { data } = await axios.put(`/api/chat/groupremove`, {
                chatId: selectedChat._id,
                userId: user1._id,
            },
                config
            );

            user1._id === user._id ? setSelectedChat() : setSelectedChat(data);
            toast({
                title: `${user1.name} remove successfully by ${user.name}`,
                status: 'error',
                duration: 2000,
                position: 'top-right',
                isClosable: true,
            })
            setFetchAgain(!fetchAgain);
            fetchMessages();
            setLoading(false);

        } catch (error) {
            toast({
                title: 'Error Occured!',
                description: error?.response?.data?.message,
                status: 'error',
                duration: 2000,
                isClosable: true,
                position: "bottom",
            });
            setLoading(false);
        }
    };

    const handleRename = async () => {
        if (!groupChatName) return;

        try {
            setRenameLoading(true);
            const config = {
                headers:
                {
                    "Authorization": `Bearer ${user.token}`
                },
            };

            const { data } = await axios.put("/api/chat/rename", {
                chatId: selectedChat._id,
                chatName: groupChatName,
            },
                config
            );

            setSelectedChat(data);
            toast({
                title: `${user.name} Rename of Group Successfull change ${groupChatName}`,
                status: 'success',
                duration: 2000,
                position: 'top-right',
                isClosable: true,
            })
            setFetchAgain(!fetchAgain);
            setRenameLoading(false);

        } catch (error) {
            toast({
                title: "Error Occured!",
                description: error?.response?.data?.message || "Something went wrong.",
                status: "error",
                duration: 2000,
                position: "bottom",
                isClosable: true,
            });
            setRenameLoading(false);
        }
        setGroupChatName("");
    };

    // const handleSearch = () => { };
    const handleSearch = async (query) => {
        setSearch(query);
        if (!query) {
            return;
        }
        try {
            setLoading(true);
            const config = {
                headers: {
                    Authorization: `Bearer ${user.token}`
                },
            };

            const { data } = await axios.get(`/api/user?search=${search}`, config);
            // console.log(data);
            setLoading(false);
            setSearchResult(data);
        } catch (error) {
            toast({
                title: "Error Occured!",
                description: "Failed to Load the Search Results",
                status: "error",
                duration: 2000,
                isClosable: true,
                position: "bottom-left",
            });
        }
    };

    return (
        <>
            <IconButton
                display="flex"
                icon={<ViewIcon />}
                onClick={onOpen}
            />

            <Modal isOpen={isOpen} onClose={onClose} isCentered>
                <ModalOverlay />
                <ModalContent>
                    <ModalHeader
                        fontSize="35px"
                        display="flex"
                        justifyContent="center"
                    >
                        {selectedChat.chatName}
                    </ModalHeader>
                    <ModalCloseButton />
                    <ModalBody>
                        <Box w="100%" display="flex" flexWrap="wrap" pb={3}>
                            {
                                selectedChat.users.map((u) => (
                                    <UserBadgeItem
                                        key={user._id}
                                        user={u}
                                        handleFunction={() => handleRemove(u)}
                                    />
                                ))
                            }
                        </Box>
                        <FormControl display="flex">
                            <Input
                                placeholder="Chat Name"
                                mb={3}
                                value={groupChatName}
                                onChange={e => setGroupChatName(e.target.value)}
                            />
                            <Button
                                colorScheme='teal'
                                variant="solid"
                                ml={1}
                                isLoading={renameLoading}
                                onClick={handleRename}
                            >
                                Update
                            </Button>
                        </FormControl>
                        <FormControl>
                            <Input
                                placeholder="Add User to Group"
                                mb={1}
                                onChange={(e) => handleSearch(e.target.value)}
                            />
                        </FormControl>
                        {loading ? (
                            <Spinner size={'lg'} />
                        ) : (
                            searchResult?.map((user) => (
                                <UserList
                                    key={user._id}
                                    user={user}
                                    handleFunction={() => handleAddUser(user)}
                                />
                            ))
                        )}
                    </ModalBody>

                    <ModalFooter>
                        <Button colorScheme='red' onClick={() => handleRemove(user)}>
                            Leave Group
                        </Button>
                    </ModalFooter>
                </ModalContent>
            </Modal>
        </>
    )
}

export default UpdateGroupChatModal
