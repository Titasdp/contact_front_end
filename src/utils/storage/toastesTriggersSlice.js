import { createSlice } from "@reduxjs/toolkit";

export const toastesTriggersSlice = createSlice({
  name: "toastesTriggers",
  initialState: {
    value: {
      user_expire_trigger: false,
      forced_password_change_trigger: false,
      forced_loggin_trigger: false,
    },
  },
  reducers: {
    update_toastes_trigger_value: (state, action) => {
      state.value = action.payload;
    },
  },
});

export const { update_toastes_trigger_value } = toastesTriggersSlice.actions;

export default toastesTriggersSlice.reducer;
