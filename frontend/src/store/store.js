import {configureStore} from "@reduxjs/toolkit"
import MessageSlice from "./MessageSlice.js"
import AuthSlice from "./Authentication.js"

const store = configureStore({
    reducer:{
        message: MessageSlice,
        auth: AuthSlice
    }
});

export default store;