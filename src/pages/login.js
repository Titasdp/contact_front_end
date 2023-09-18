import React from "react";
import { Toaster } from "react-hot-toast";
import LoginForm from "../components/login/loginForm";

export default function Login() {
  return (
    <div>
      <Toaster position="top-right"></Toaster>
      <LoginForm></LoginForm>
    </div>
  );
}
