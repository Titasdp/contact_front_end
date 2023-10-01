import React, { useState } from "react";
import PhoneInput from "react-phone-number-input";
import "react-phone-number-input/style.css";
import { exec_register_user } from "../../utils/api/users/usersController";
import toast from "react-hot-toast";
import { useNavigate } from "react-router-dom";
import AxiosResponseErrors from "../../utils/customeErrors/axiosResponse";

const RegisterForm = () => {
  const navigate = useNavigate();
  const [email, set_email] = useState("");
  const [full_name, set_name] = useState("");
  const [locality, set_locality] = useState("");
  const [age, set_age] = useState("");
  const [phone_numb, set_phone_numb] = useState("");
  const [submit_runnig, set_submit_runnig] = useState(false);

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
    try {
      set_submit_runnig(true);
      await toast.promise(handle_api_request(), {
        loading: "Creating user...",
        success: (message) => {
          return message;
        },
        error: (error) => {
          return "Fail To create user";
        },
      });
    } catch (custom_error) {
      if (custom_error.status_code === 400 || custom_error.status_code === 422)
        for (const err of custom_error.errors) {
          toast.error(`${err.message} `, {
            style: {
              borderRadius: "10px",
              background: "#333",
              color: "#fff",
            },
          });
        }
    }
    set_submit_runnig(false);
  };

  const handle_api_request = async () => {
    return new Promise(async (resolve, reject) => {
      await setTimeout(async () => {
        const exec_result = await exec_register_user(
          email,
          full_name,
          locality,
          age,
          phone_numb
        );

        console.log("testing", exec_result);
        if (exec_result.resp_code === 201) {
          resolve(exec_result.data.message);
        } else if (
          exec_result.resp_code === 400 ||
          exec_result.resp_code === 422
        ) {
          const array_of_errors = exec_result.data.process_result;
          reject(
            new AxiosResponseErrors(exec_result.resp_code, array_of_errors)
          );
        } else {
          // Error page must be added
        }
      }, 1000);
    });
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
          <button
            className="btn btn btn-outline-secondary mt-4"
            type="submit"
            disabled={submit_runnig}
          >
            REGISTER
          </button>
        </form>
      </div>

      <button
        className="btn btn btn-outline-secondary mt-4"
        onClick={move_to_login}
      >
        BACK TO LOGIN
      </button>
    </div>
  );
};

export default RegisterForm;
