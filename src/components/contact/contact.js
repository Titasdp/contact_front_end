import React, { useState } from "react";
import ContactForm from "./contactForm";
import { RiCloseCircleLine } from "react-icons/ri";
import { TiEdit } from "react-icons/ti";

const Contact = ({ contacts, remove_contact, update_contact }) => {
  const user_id = "";
  const sumbite_update = (values) => {
    update_contact(values);
    set_edit({
      id: null,
      value: "",
    });
  };
  const [edit, set_edit] = useState({
    id: null,
    value: "",
  });

  if (edit.id) {
    return (
      <ContactForm
        initial_name={edit.value.full_name}
        initial_email={edit.value.email}
        initial_locality={edit.value.locality}
        initial_address={edit.value.address}
        initial_phone_numb={edit.value.phone_numb}
        initial_obs={edit.value.obs}
        on_submit={sumbite_update}
        id={edit.id}
      />
    );
  }

  return contacts.map((contact, index) => (
    <div key={`${user_id}//${contact.email}//${contact.phone_numb}`}>
      <div className="">{contact.email}</div>
      <div className=""> {contact.phone_numb} </div>
      <div className="">{contact.full_name} </div>
      <div className="">{contact.locality} </div>
      <div className="">{contact.address} </div>
      <div className="">{contact.obs} </div>
      <div className="icons">
        <RiCloseCircleLine
          onClick={() =>
            remove_contact(`${contact.email}//${contact.phone_numb}`)
          }
          className="delete-icon"
        />
      </div>

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
        className="edit-icon"
      />
    </div>
  ));
};

export default Contact;
