import axios from "axios";
import { ChatState } from "../context/ChatProvider.jsx";

const API = axios.create({ baseURL: process.env.REACT_APP_BASEURL });
const { user } = ChatState();
API.interceptors.request.use((req) => {
    if (localStorage.getItem("userInfo")) {
        req.headers.Authorization = `Bearer ${user.token}`
    }
    return req;
});

export default API;