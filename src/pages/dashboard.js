import { useNavigate } from "react-router-dom";
import React from "react";
import ContactList from "../components/contact/contactList";

import { Toaster } from "react-hot-toast";
export default function Dashboard() {


  return (
    <div>
      <ContactList></ContactList>
      {/* <NewContactForm> </NewContactForm> */}
    </div>
  );
}
