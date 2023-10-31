import { Button, FormControl, FormLabel, Input, InputGroup, InputRightElement, VStack, useToast } from '@chakra-ui/react'
import axios from 'axios';
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom'

const Signup = () => {
    const [show, setShow] = useState();
    const [confirmshow, setConfirmshow] = useState();
    const [name, setName] = useState();
    const [email, setEmail] = useState();
    const [password, setPassword] = useState();
    const [confirmpassword, setConfirmpassword] = useState();
    const [pic, setPic] = useState();
    const [loading, setLoading] = useState(false);
    const toast = useToast();
    const navigate = useNavigate();

    const handleClick = () => setShow(!show);
    const handleClickForConfirm = () => setConfirmshow(!confirmshow);
    const postDetails = (pics) => {
        setLoading(true);
        if (pics === undefined) {
            toast({
                title: 'Please Select an Image!',
                status: 'warning',
                duration: 2000,
                isClosable: true,
                position: 'bottom',
            });
            return;
        }
        if (pics.type === "image/jpeg" || pics.type === "image/png") {
            const data = new FormData();
            data.append("file", pics);
            data.append("upload_preset", "chat-app");
            data.append("cloud_name", "deepvadhadiya");
            fetch("https://api.cloudinary.com/v1_1/deepvadhadiya/upload", {
                method: 'post',
                body: data,
            }).then((res) => res.json())
                .then(data => {
                    setPic(data.url.toString());
                    console.log(data.url.toString());
                    setLoading(false);
                })
                .catch((err) => {
                    console.log(err);
                    setLoading(false);
                })
        } else {
            toast({
                title: 'Please Select an Image!',
                status: 'warning',
                duration: 2000,
                isClosable: true,
                position: 'bottom',
            });
            setLoading(false);
            return;
        }
    };
    const submitHandler = async () => {
        setLoading(true);
        if (!name || !email || !password || !confirmpassword) {
            toast({
                title: 'Please Fill all the Fields',
                status: 'warning',
                duration: 2000,
                isClosable: true,
                position: 'bottom',
            });
            setLoading(false);
            return;
        }
        if (password !== confirmpassword) {
            toast({
                title: 'Password Do Not Match',
                status: 'warning',
                duration: 2000,
                isClosable: true,
                position: 'bottom',
            });
            return;
        }

        try {
            const config = {
                headers: {
                    "Content-Type": "application/json",
                },
            };

            const { data } = await axios.post("/api/user", { name, email, password, pic }, config);

            toast({
                title: 'Registration Successful',
                status: 'success',
                duration: 2000,
                isClosable: true,
                position: 'bottom',
            });

            localStorage.setItem('userInfo', JSON.stringify(data));
            setLoading(false);
            navigate('/chats');
        } catch (error) {
            toast({
                title: 'Error Occured!',
                description: error.response.data.message,
                status: 'error',
                duration: 2000,
                isClosable: true,
                position: 'bottom',
            });
            setLoading(false);
        }
    };

    return (
        <VStack spacing="5px">
            <FormControl id="first-name" isRequired>
                <FormLabel fontWeight="extrabold">Name</FormLabel>
                <Input
                    bg="#bee3f8"
                    fontWeight="extrabold"
                    placeholder='Name'
                    onChange={(e) => setName(e.target.value)}
                />
            </FormControl>
            <FormControl id="email" isRequired>
                <FormLabel fontWeight="extrabold">Email</FormLabel>
                <Input
                    bg="#bee3f8"
                    fontWeight="extrabold"
                    placeholder='Email'
                    onChange={(e) => setEmail(e.target.value)}
                />
            </FormControl>
            <FormControl id="password" isRequired>
                <FormLabel fontWeight="extrabold">Password</FormLabel>
                <InputGroup bg="#bee3f8" style={{ borderRadius: "var(--input-border-radius)" }}>
                    <Input
                        fontWeight="extrabold"
                        type={show ? "text" : "password"}
                        placeholder='Password'
                        onChange={(e) => setPassword(e.target.value)}
                    />
                    <InputRightElement w="4.5rem">
                        <Button bg="transparent" h="1.75rem" size="sm" onClick={handleClick}>
                            {show ? "Hide" : "Show"}
                        </Button>
                    </InputRightElement>
                </InputGroup>
            </FormControl>
            <FormControl id="confirmpassword" isRequired>
                <FormLabel fontWeight="extrabold">Confirm Password</FormLabel>
                <InputGroup bg="#bee3f8" style={{ borderRadius: "var(--input-border-radius)" }}>
                    <Input
                        fontWeight="extrabold"
                        type={confirmshow ? "text" : "password"}
                        placeholder='Confirm Password'
                        onChange={(e) => setConfirmpassword(e.target.value)}
                    />
                    <InputRightElement w="4.5rem">
                        <Button bg="transparent" h="1.75rem" size="sm" onClick={handleClickForConfirm}>
                            {confirmshow ? "Hide" : "Show"}
                        </Button>
                    </InputRightElement>
                </InputGroup>
            </FormControl>
            <FormControl id="pic">
                <FormLabel fontWeight="extrabold">Upload Your Picture</FormLabel>
                <Input
                    type="file"
                    accept="image/*"
                    p={1.5}
                    onChange={(e) => postDetails(e.target.files[0])}
                />
            </FormControl>
            <Button
                colorScheme="blue"
                width="100%"
                style={{ marginTop: 15 }}
                onClick={submitHandler}
                isLoading={loading}
            >
                Sign Up
            </Button>
        </VStack>
    )
}

export default Signup
