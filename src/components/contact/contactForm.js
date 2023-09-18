import React, { useState, useEffect, useRef } from "react";
import PhoneInput from "react-phone-number-input";
import "react-phone-number-input/style.css";

function ContactForm({initial_name ,initial_email,initial_locality, initial_phone_numb, initial_obs ,init_address, on_submit , id}) {
  const [email, set_email] = useState(initial_email);
  const [full_name, set_name] = useState(initial_name);
  const [locality, set_locality] = useState(initial_locality);
  const [address, set_address] = useState(init_address)
  const [phone_numb, set_phone_numb] = useState(initial_phone_numb);
  const [obs, set_obs] = useState(initial_obs);


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

  const handle_submit = (e) => {
    e.preventDefault();

   on_submit({
      old_email:id.split("//")[0],
      old_phone_numb:id.split("//")[1],
      email: email,
      full_name: full_name,
      locality: locality,
      address: address,
      phone_numb: phone_numb,
      obs: obs,
    });
  };

  return (
    <div>
      <h2>Edit Contact</h2>

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

export default ContactForm;
