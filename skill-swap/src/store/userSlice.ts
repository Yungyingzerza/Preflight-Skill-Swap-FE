import { createSlice } from "@reduxjs/toolkit";
import type { IUser } from "@interfaces/IUser";

const initialState: IUser = {
  id: "",
  fullname: "",
  lastname: "",
  email: "",
  picture_url: "",
};

export const userSlice = createSlice({
  name: "user",
  initialState,
  reducers: {
    setId: (state, action) => {
      state.id = action.payload;
    },
    setFullName: (state, action) => {
      state.fullname = action.payload;
    },
    setLastName: (state, action) => {
      state.lastname = action.payload;
    },
    setEmail: (state, action) => {
      state.email = action.payload;
    },
    setPictureUrl: (state, action) => {
      state.picture_url = action.payload;
    },
  },
});

export const { setId, setFullName, setEmail, setLastName, setPictureUrl } =
  userSlice.actions;
export default userSlice.reducer;
