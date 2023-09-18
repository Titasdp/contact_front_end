import { createSlice } from "@reduxjs/toolkit";

export const loggedUserSlice = createSlice({
  name: "loggedUser",
  initialState: {
    value: {
      user_token: "",
      user_id: "",
      user_contacts: [],
      user_information: "",
    },
  },
  reducers: {
    add_value: (state, action) => {
      state.value = action.payload;
    },
  },
});

export const { add_value } = loggedUserSlice.actions;

export default loggedUserSlice.reducer;
