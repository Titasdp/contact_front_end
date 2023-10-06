import React, { useState, useEffect, useRef } from "react";
import PhoneInput from "react-phone-number-input";
import "react-phone-number-input/style.css";

export default function EditProfileForm({
  initial_name,
  initial_locality,
  initial_phone_numb,
  initial_age,
  on_submit,
  on_cancel,
  user_id,
  submit_running,
  set_submit_running,
}) {
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
    set_submit_running(true);

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
      <div className="container-fluid  d-flex justify-content-start align-items-center flex-row">
        <button
          disabled={submit_running}
          onClick={on_cancel}
          className="btn btn-outline-secondary mr-2"
        >
          {" "}
          CANCEL UPDATE
        </button>
        <p style={{ padding: "10px 0px", margin: "0px 0px 0px 10px" }}>
          /dasboard/profile/update
        </p>
      </div>

      <div className="relative d-flex flex-column container text-center">
        <div className="p-5 rounded gradiant_background justify-content-center align-items-center mt-5">
          <h2>EDIT PROFILE</h2>

          <form onSubmit={handle_submit}>
            <div className="custom_input-group">
              <input
                className="custom_input"
                id="full_name"
                placeholder="Full Name:"
                type="text"
                value={full_name}
                onChange={handle_change_name}
                required
              />
            </div>
            <br />
            <div className="custom_input-group">
              <input
                className="custom_input"
                placeholder="Locality:"
                id="locality"
                type="text"
                value={locality}
                onChange={handle_change_locality}
                required
              />
            </div>
            <br />
            <div className="custom_input-group">
              <input
                className="custom_input"
                placeholder="age"
                id="age"
                value={age}
                onChange={handle_change_age}
                required
              />
            </div>
            <br />
            <div className="custom_input-group">
              <PhoneInput
                placeholder="Enter phone number"
                value={phone_numb}
                onChange={set_phone_numb}
                required
              />
            </div>

            <button className="btn btn-light mt-4" type="submit">
              UPDATE PROFILE
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}
