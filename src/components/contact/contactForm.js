import React, { useState } from "react";
import PhoneInput from "react-phone-number-input";
import "react-phone-number-input/style.css";

function ContactForm({
  initial_name,
  initial_email,
  initial_locality,
  initial_phone_numb,
  initial_obs,
  initial_address,
  on_submit,
  id,
  on_cancel,
}) {
  const [email, set_email] = useState(initial_email);
  const [full_name, set_name] = useState(initial_name);
  const [locality, set_locality] = useState(initial_locality);
  const [address, set_address] = useState(initial_address);
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
      old_email: id.split("//")[0],
      old_phone_numb: id.split("//")[1],
      email: email,
      full_name: full_name,
      locality: locality,
      address: address,
      phone_numb: phone_numb,
      obs: obs,
    });
  };

  return (
    <>
      <div className="container-fluid  d-flex justify-content-start align-items-center flex-row">
        <button
          className="btn btn-outline-secondary mr-2"
          onClick={function () {
            on_cancel();
          }}
        >
          CANCEL
        </button>

        <p style={{ padding: "10px 0px", margin: "0px 0px 0px 10px" }}>
          /dashboard/contacts/update
        </p>
      </div>

      <div className="relative d-flex flex-column container text-center">
        <div className="p-5 rounded gradiant_background justify-content-center align-items-center mt-5">
          <h2>EDIT CONTACT</h2>
          <form onSubmit={handle_submit}>
            <div className="custom_input-group">
              <input
                className="custom_input"
                id="email"
                placeholder="Email:"
                type="email"
                value={email}
                onChange={handle_change_email}
                required
              />
            </div>
            <br />
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
                placeholder="Address"
                className="custom_input"
                id="address"
                type="text"
                value={address}
                onChange={handle_change_address}
                required
              />
            </div>
            <br />

            <div className="custom_input_for_text_area">
              <textarea
                className="custom_text-area"
                placeholder="Enter an observation"
                id="obs"
                value={obs}
                onChange={handle_change_obs}
                required
              />
            </div>
            <br />
            <div className="custom_input-group">
              <PhoneInput
                className="d-flex flex-row"
                placeholder="Enter phone number"
                value={phone_numb}
                onChange={set_phone_numb}
                required
              />
            </div>

            <button className="btn btn-light mt-4" type="submit">
              UPDATE CONTACT
            </button>
          </form>
        </div>
      </div>
    </>
  );
}

export default ContactForm;
