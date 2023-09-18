import React, { useState, useEffect, useRef } from "react";
import PhoneInput from "react-phone-number-input";
import "react-phone-number-input/style.css";

export default function EditProfileForm({initial_name,initial_locality, initial_phone_numb, initial_age , on_submit, on_cancel , user_id}) {
  const [full_name, set_name] = useState(initial_name);
  const [locality, set_locality] = useState(initial_locality);
  const [phone_numb, set_phone_numb] = useState(initial_phone_numb);
  const [age, set_age] = useState(initial_age);


  const handle_change_name = (e) => {

    set_name(e.target.value);
  };

  const handle_change_locality = (e) => {
    set_locality(e.target.value);
  };

  const handle_change_age = (e) => {
    set_age(e.target.value);
  };

  const handle_submit = (e) => {
  
    e.preventDefault();

    on_submit({
      user_id: user_id,
      full_name: full_name,
      locality: locality,
      phone_numb: phone_numb,
      age: age,
    });
  };

  return (
    <div>
      <h2>EDIT PROFILE</h2>

      <form onSubmit={handle_submit}>
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
        <br />

        <input
          placeholder="age"
          id="age"
          value={age}
          onChange={handle_change_age}
          required
        />
        <br />

        <PhoneInput
          placeholder="Enter phone number"
          value={phone_numb}
          onChange={set_phone_numb}
          required
          
        />

        <button type="submit">Edit Contact</button>
      </form>
    </div>
  );
}
