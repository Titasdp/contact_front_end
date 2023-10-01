import React, { useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import {
  exec_patch_password,
  exec_get_user_info,
} from "../../utils/api/users/usersController";
import toast from "react-hot-toast";
import { useNavigate } from "react-router-dom";
import { add_value } from "../../utils/storage/loggedUserSlice";
import AxiosResponseErrors from "../../utils/customeErrors/axiosResponse";

export default function EditPasswordForm() {
  const navigate = useNavigate();
  const [old_passowrd, set_old_passowrd] = useState("");
  const [new_password, set_new_password] = useState("");
  const [password_confirmation, set_password_confirmation] = useState("");
  const dispatch = useDispatch();
  let logged_user_info = useSelector((state) => state.loggedUser.value);

  const handle_old_password_change = (e) => {
    set_old_passowrd(e.target.value);
  };

  const handle_new_password_change = (e) => {
    set_new_password(e.target.value);
  };

  const handle_password_confirmation_change = (e) => {
    set_password_confirmation(e.target.value);
  };

  const handle_submit = async (e) => {
    e.preventDefault();
    try {
      await toast.promise(handle_api_requests(), {
        loading: "Updating...",
        success: (message) => {
          set_old_passowrd("");
          set_new_password("");
          set_password_confirmation("");

          return message;
        },
        error: (error) => {
          return "Password update failed...";
        },
      });
    } catch (custom_error) {
      if ([400, 422, 404].includes(custom_error.status_code))
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
  };

  const handle_api_requests = async () => {
    return new Promise(async (resolve, reject) => {
      await setTimeout(async () => {
        const exec_result = await exec_patch_password(
          logged_user_info.user_id,
          password_confirmation,
          new_password,
          old_passowrd,
          logged_user_info.user_token
        );

        if (exec_result.resp_code === 200) {
          //Todo - > validate this process
          const user_info = await exec_get_user_info(
            logged_user_info.user_id,
            logged_user_info.user_token
          );

          await dispatch(
            add_value({
              user_token: logged_user_info.user_token,
              user_id: logged_user_info.user_id,
              user_contacts: logged_user_info.user_contacts,
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
          // Error page must be added
        }
      }, 1000);
    });
  };

  return (
    <div>
      <h2>EDIT PASSWORD FORM</h2>
      <form onSubmit={handle_submit}>
        <input
          id="new_password"
          placeholder="New Password:"
          type="password"
          value={new_password}
          onChange={handle_new_password_change}
          required
        />
        <br />
        <input
          id="confirm_password"
          placeholder="Confirm password:"
          type="password"
          value={password_confirmation}
          onChange={handle_password_confirmation_change}
          required
        />
        <br />
        <input
          id="old_password"
          placeholder="Old password:"
          type="password"
          value={old_passowrd}
          onChange={handle_old_password_change}
          required
        />
        <button type="submit">UPDATE PASSWORD</button>
      </form>

      <button
        onClick={function () {
          navigate("/");
        }}
      >
        GO BACK
      </button>
    </div>
  );
}
