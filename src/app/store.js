import { configureStore } from "@reduxjs/toolkit";
import loggedUserSlice from "../utils/storage/loggedUserSlice";
import toastesTriggersSlice from "../utils/storage/toastesTriggersSlice";

export default configureStore({
  reducer: {
    loggedUser: loggedUserSlice,
    toastesTriggers: toastesTriggersSlice,
  },
});
