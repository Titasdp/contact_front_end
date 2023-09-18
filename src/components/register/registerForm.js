import React, { useState } from "react";
import PhoneInput from "react-phone-number-input";
import "react-phone-number-input/style.css";
import { exec_register_user } from "../../utils/api/users/usersController";
import toast from "react-hot-toast";
import { useNavigate } from "react-router-dom";

const RegisterForm = (props) => {
  const navigate = useNavigate();
  const [email, set_email] = useState("");
  const [full_name, set_name] = useState("");
  const [locality, set_locality] = useState("");
  const [age, set_age] = useState("");
  const [phone_numb, set_phone_numb] = useState("");
  const move_to_login = () => {
    navigate("/login");
  };

  const handle_change_email = (e) => {
    set_email(e.target.value);
  };

  const handle_change_name = (e) => {
    set_name(e.target.value);
  };

  const handle_change_age = (e) => {
    set_age(e.target.value);
  };
  const handle_change_locality = (e) => {
    set_locality(e.target.value);
  };

  const handle_submit = async (e) => {
    e.preventDefault();

    const exec_result = await exec_register_user(
      email,
      full_name,
      locality,
      age,
      phone_numb
    );

    if (exec_result.resp_code < 300) {
      toast.success(`${exec_result.data.message} `, {
        style: {
          borderRadius: "10px",
          background: "#333",
          color: "#fff",
          duration: 6000,
        },
      });

      setTimeout(() => {
        navigate("/login"); // Redirect to the login page after the delay
      }, 6000);
    } else if (exec_result.resp_code >= 400) {
      const array_of_errors = exec_result.data.process_result;
      for (const err of array_of_errors) {
        toast.error(`${err.error_message} `, {
          style: {
            borderRadius: "10px",
            background: "#333",
            color: "#fff",
            duration: 2000,
          },
        });
      }
    } else {
    }
  };

  return (
    <div
      className="d-flex justify-content-center align-items-center flex-column container-fluid"
      style={{ height: "100vh" }}
    >
      <div className="text-center mg-">
        <h2>REGISTER FORM</h2>
        <form onSubmit={handle_submit}>
          <input
            className="form-control form-control-lg"
            id="email"
            placeholder="Email:"
            type="email"
            value={email}
            onChange={handle_change_email}
            required
          />
          <br />

          <input
            className="form-control form-control-lg"
            id="full_name"
            placeholder="Full Name:"
            type="text"
            value={full_name}
            onChange={handle_change_name}
            required
          />
          <br />
          <input
            className="form-control form-control-lg"
            placeholder="Locality:"
            id="locality"
            type="text"
            value={locality}
            onChange={handle_change_locality}
            required
          />
          <br />
          <input
            className="form-control form-control-lg"
            placeholder="Age"
            id="age"
            type="number"
            value={age}
            onChange={handle_change_age}
            required
          />
          <br />

          <PhoneInput
            placeholder="Enter phone number"
            className="form-control form-control-lg d-flex flex-row"
            value={phone_numb}
            onChange={set_phone_numb}
          />
          <button className="btn btn btn-outline-secondary mt-4" type="submit">REGISTER</button>
        </form>
      </div>

      <button
        className="btn btn btn-outline-secondary mt-4"
        onClick={move_to_login}
      >
        CANCEL
      </button>
    </div>
  );
};

export default RegisterForm;
