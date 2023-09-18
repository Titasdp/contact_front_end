import { configureStore } from "@reduxjs/toolkit";
import loggedUserSlice from "../utils/storage/loggedUserSlice";

export default configureStore({
  reducer: {
    loggedUser: loggedUserSlice,
  },
});
