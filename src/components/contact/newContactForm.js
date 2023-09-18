import React, { useState } from "react";
import PhoneInput from "react-phone-number-input";
import { useSelector, useDispatch } from "react-redux";
import "react-phone-number-input/style.css";
import { exec_add_user_contact ,exec_get_user_contacts} from "../../utils/api/contacts/contactController";
import toast from "react-hot-toast";
import { add_value } from "../../utils/storage/loggedUserSlice";



export default function NewContactForm({ set_contacts, contacts }) {
  const [email, set_email] = useState("");
  const [full_name, set_name] = useState("");
  const [locality, set_locality] = useState("");
  const [address, set_address] = useState("");
  const [phone_numb, set_phone_numb] = useState("");
  const [obs, set_obs] = useState("");
  const dispatch = useDispatch();

  let logged_user_info = useSelector((state) => state.loggedUser.value);

  const handle_change_email = (e) => {
    set_email(e.target.value);
  };

  const handle_change_name = (e) => {
    set_name(e.target.value);
  };

  const handle_change_address = (e) => {
    set_address(e.target.value);
  };
  const handle_change_locality = (e) => {
    set_locality(e.target.value);
  };

  const handle_change_obs = (e) => {
    set_obs(e.target.value);
  };

  const handle_submit = async (e) => {
    e.preventDefault();

    const exec_result = await exec_add_user_contact(
      email,
      full_name,
      locality,
      obs,
      phone_numb,
      address,
      logged_user_info.user_id,
      logged_user_info.user_token
    );
    if (exec_result.resp_code < 300) {
    

      const get_contact_exec_result = await exec_get_user_contacts(
        logged_user_info.user_id,
        logged_user_info.user_token
      )


      await dispatch(
        add_value({
          user_token:  logged_user_info.user_token,
          user_id:  logged_user_info.user_id,
          user_contacts: get_contact_exec_result.data.process_result.contacts,
          user_information:  logged_user_info.user_information,
        })
      );
      set_contacts(get_contact_exec_result.data.process_result.contacts);

      toast.success(`${exec_result.data.message} `, {
        style: {
          borderRadius: "10px",
          background: "#333",
          color: "#fff",
          duration: 6000,
        },
      });
    } else if (exec_result.resp_code >= 400 && exec_result.resp_code < 500) {
      exec_result.data.process_result.forEach((item) => {
        toast.error(`${item.message} `, {
          style: {
            borderRadius: "10px",
            background: "#333",
            color: "#fff",
            duration: 4000,
          },
        });
      });
    } else {
      toast.error(`Something when wrong please restart the application `, {
        style: {
          borderRadius: "10px",
          background: "#333",
          color: "#fff",
          duration: 2000,
        },
      });
    }
  };

  return (
    <div>
      <h2>Add Contact</h2>

      <form onSubmit={handle_submit}>
        <input
          id="email"
          placeholder="Email:"
          type="email"
          value={email}
          onChange={handle_change_email}
          required
        />
        <br />

        <input
          id="full_name"
          placeholder="Full Name:"
          type="text"
          value={full_name}
          onChange={handle_change_name}
          required
        />
        <br />

        <input
          placeholder="Locality:"
          id="locality"
          type="text"
          value={locality}
          onChange={handle_change_locality}
          required
        />
        <br />
        <input
          placeholder="Address"
          id="address"
          type="text"
          value={address}
          onChange={handle_change_address}
          required
        />
        <br />

        <textarea
          placeholder="Enter an observation"
          id="obs"
          value={obs}
          onChange={handle_change_obs}
          required
        />
        <br />

        <PhoneInput
          placeholder="Enter phone number"
          value={phone_numb}
          onChange={set_phone_numb}
          required
        />

        <button type="submit">Create Contact</button>
      </form>
    </div>
  );
}
