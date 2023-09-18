import { useNavigate } from "react-router-dom";
import React from "react";
import ContactList from "../components/contact/contactList";
import NewContactForm from "../components/contact/newContactForm";
import { Toaster } from "react-hot-toast";
export default function Dashboard() {
  const navigate = useNavigate();

  const move_to_profile = () => {
    navigate("/profile");
  };
  const logout = () => {
    navigate("/profile");
  };
  

  const move_to_contact_dashboard = () => {
    navigate("/contacts");
  };


  return (
    <div>
      <Toaster position="top-right"></Toaster>
      <ContactList></ContactList>
      {/* <NewContactForm> </NewContactForm> */}
    </div>
  );
}
