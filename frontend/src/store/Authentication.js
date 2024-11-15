import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  status: false,
  userData: "",
};

const AuthSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    login: (state, action) => {
      state.status = true;
      state.userData = action.payload;

    //   checking......
      // console.log(state.userData);
      // console.log(state.status);
    },

    logout: (state) => {
      state.status = false;
      state.userData = null;
    },
  },
});

export const {login, logout} = AuthSlice.actions;
export default AuthSlice.reducer;
