import React from "react";
import RegisterForm from "../components/register/registerForm";
import { Toaster } from "react-hot-toast";

export default function Register() {
  return (
    <div>
      <Toaster position="top-right"></Toaster>
      <RegisterForm></RegisterForm>
    </div>
  );
}
