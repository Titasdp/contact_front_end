import React, { useState } from "react";
import {
  exec_login_user,
  exec_get_user_info,
} from "../../utils/api/users/usersController";
import { useSelector, useDispatch } from "react-redux";
import toast from "react-hot-toast";
import { useNavigate } from "react-router-dom";
import { add_value } from "../../utils/storage/loggedUserSlice";
import { exec_get_user_contacts } from "../../utils/api/contacts/contactController";

const LoginForm = () => {
  const navigate = useNavigate();
  const [email, set_email] = useState("");
  const [password, set_password] = useState("");
  const dispatch = useDispatch();

  const move_to_register = () => {
    navigate("/register");
  };

  const handle_change_email = (e) => {
    set_email(e.target.value);
  };

  const handle_change_password = (e) => {
    set_password(e.target.value);
  };

  const handle_submit = async (e) => {
    e.preventDefault();

    const exec_result = await exec_login_user(email, password);
    if (exec_result.resp_code < 300) {
      const get_contact_exec_result = await exec_get_user_contacts(
        exec_result.data.process_result.user_id,
        exec_result.data.process_result.token
      );

      const user_info = await exec_get_user_info(
        exec_result.data.process_result.user_id,
        exec_result.data.process_result.token
      );

      await dispatch(
        add_value({
          user_token: exec_result.data.process_result.token,
          user_id: exec_result.data.process_result.user_id,
          user_contacts: get_contact_exec_result.data.process_result.contacts,
          user_information: user_info.data.process_result.user,
        })
      );

      toast.success(`Give as a min to prepare everyting, welcome back ....`, {
        style: {
          borderRadius: "10px",
          background: "",
          color: "#fff",
          duration: 4000,
        },
      });
      setTimeout(() => {
        navigate("/"); // Redirect to the login page after the delay
      }, 6000);
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
      toast.error(` ${exec_result.data.message}`, {
        style: {
          borderRadius: "10px",
          background: "#333",
          color: "#fff",
          duration: 4000,
        },
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
    <div
      className="d-flex justify-content-center align-items-center flex-column container-fluid"
      style={{ height: "100vh" }}
    >
      <div className="text-center mg-">
        <h2>LOGIN FORM</h2>

        <form onSubmit={handle_submit}>
          <div className="form-group">
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
          </div>

          <div className="form-group">
            <input
              className="form-control form-control-lg"
              id="password"
              placeholder="password:"
              type="password"
              value={password}
              onChange={handle_change_password}
              required
            />
            <br />
          </div>

          <button className="btn btn btn-outline-secondary mr-2" type="submit">
            LOGIN
          </button>
        </form>
      </div>

      <button
        className="btn btn btn-outline-secondary mt-4"
        type="submit"
        onClick={move_to_register}
      >
        REGISTER NOW
      </button>
    </div>
  );
};

export default LoginForm;
