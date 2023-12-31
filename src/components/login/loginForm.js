import React, { useState } from "react";
import {
  exec_login_user,
  exec_get_user_info,
} from "../../utils/api/users/usersController";
import { useDispatch } from "react-redux";
import toast from "react-hot-toast";
import { useNavigate } from "react-router-dom";
import { add_value } from "../../utils/storage/loggedUserSlice";
import { exec_get_user_contacts } from "../../utils/api/contacts/contactController";
import AxiosResponseErrors from "../../utils/customeErrors/axiosResponse";

const LoginForm = () => {
  const navigate = useNavigate();
  const [email, set_email] = useState("");
  const [password, set_password] = useState("");
  const dispatch = useDispatch();
  const [submit_runnig, set_submit_runnig] = useState(false);

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
    try {
      set_submit_runnig(true);
      await toast.promise(handle_api_requests(), {
        loading: "Loading...",
        success: (message) => {
          return message;
        },
        error: (error) => {
          return "Login failed";
        },
      });

      setTimeout(() => {
        navigate("/");
      }, 1000);
    } catch (custom_error) {
      if ([400, 422, 404].includes(custom_error.status_code)) {
        for (const err of custom_error.errors) {
          toast.error(`${err.message} `, {
            style: {
              borderRadius: "10px",
              background: "#333",
              color: "#fff",
            },
          });
        }
      } else {
        toast.error(
          `An issue occurred. Please try again. If the problem persists, contact our support team.`,
          {
            style: {
              borderRadius: "10px",
              background: "#333",
              color: "#fff",
            },
          }
        );
      }
    }
    set_submit_runnig(false);
  };

  const handle_api_requests = async () => {
    return new Promise(async (resolve, reject) => {
      await setTimeout(async () => {
        const exec_result = await exec_login_user(email, password);
        if (exec_result.resp_code === 200) {
          //Todo - > validate this process
          const get_contact_exec_result = await exec_get_user_contacts(
            exec_result.data.process_result.user_id,
            exec_result.data.process_result.token
          );
          //Todo - > validate this process
          const user_info = await exec_get_user_info(
            exec_result.data.process_result.user_id,
            exec_result.data.process_result.token
          );
          if (user_info.resp_code !== 200) {
            reject(new AxiosResponseErrors(500, []));
          }

          if (user_info.resp_code !== 200) {
            reject(new AxiosResponseErrors(500, []));
          }

          await dispatch(
            add_value({
              user_token: exec_result.data.process_result.token,
              user_id: exec_result.data.process_result.user_id,
              user_contacts:
                get_contact_exec_result.data.process_result.contacts,
              user_information: user_info.data.process_result.user,
            })
          );

          resolve(exec_result.data.message);
        } else if ([400, 422, 404].includes(exec_result.resp_code)) {
          const array_of_errors = exec_result.data.process_result;
          reject(
            new AxiosResponseErrors(exec_result.resp_code, array_of_errors)
          );
        } else {
          reject(new AxiosResponseErrors(exec_result.resp_code, []));
        }
      }, 1000);
    });
  };

  return (
    <div
      className="d-flex justify-content-center align-items-center flex-column container-fluid text-center"
      style={{ height: "100vh" }}
    >
      <div className="p-5 rounded gradiant_background justify-content-center align-items-center mt-5">
        <h2>LOGIN FORM</h2>

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
              id="password"
              placeholder="password:"
              type="password"
              value={password}
              onChange={handle_change_password}
              required
            />
          </div>

          <br />

          <button
            className="btn btn-light mt-4"
            type="submit"
            disabled={submit_runnig}
          >
            LOGIN
          </button>
        </form>
        <button
          className="btn btn-light mt-4"
          type="submit"
          onClick={move_to_register}
        >
          REGISTER NOW
        </button>
      </div>
    </div>
  );
};

export default LoginForm;
