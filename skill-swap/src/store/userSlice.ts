import { createSlice } from "@reduxjs/toolkit";
import type { IUser } from "@interfaces/IUser";

const initialState: IUser = {
  id: "",
  firstname: "",
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
    setFirstName: (state, action) => {
      state.firstname = action.payload;
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

export const { setId, setFirstName, setEmail, setLastName, setPictureUrl } =
  userSlice.actions;
export default userSlice.reducer;
