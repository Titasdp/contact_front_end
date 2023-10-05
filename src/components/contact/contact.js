import React, { useState } from "react";
import ContactForm from "./contactForm";
import { RiCloseCircleLine } from "react-icons/ri";
import { TiEdit } from "react-icons/ti";

const Contact = ({ contacts, remove_contact, update_contact ,set_edit ,start, end,search_query }) => {
  const user_id = "";

console.log(contacts)

  return (contacts.filter(data => data.full_name.toLowerCase().startsWith(search_query.toLowerCase()))).slice(start, end + 1).map((contact, index) => (
    <tr
      key={`${user_id}//${contact.email}//${contact.phone_numb}`}
    >
      <td className="">{contact.email}</td>
      <td > {contact.phone_numb} </td>
      <td >{contact.full_name} </td>
      <td >{contact.locality} </td>
      <td >{contact.address} </td>
      <td >{contact.obs} </td>
      <td className="icons">
        <RiCloseCircleLine
          onClick={() =>
            remove_contact(`${contact.email}//${contact.phone_numb}`)
          }
          className="delete-icon"
        />
      </td>
      <td className="icons">
        <TiEdit
          onClick={() =>
            set_edit({
              id: `${contact.email}//${contact.phone_numb}`,
              value: {
                email: contact.email,
                phone_numb: contact.phone_numb,
                full_name: contact.full_name,
                locality: contact.locality,
                address: contact.address,
                obs: contact.obs,
              },
            })
          }
          className="edit-icon col-sm-12 col-md-2"
        />
      </td>
    </tr>
  ));
};

export default Contact;
