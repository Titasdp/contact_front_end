import React, { useState } from "react";
import ContactForm from "./contactForm";
import { RiCloseCircleLine } from "react-icons/ri";
import { TiEdit } from "react-icons/ti";

const Contact = ({ contacts, remove_contact, update_contact ,set_edit }) => {
  const user_id = "";



  return contacts.map((contact, index) => (
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
