import React, { useState, useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import {
  exec_patch_password,
  exec_get_user_info,
} from "../../utils/api/users/usersController";
import toast from "react-hot-toast";
import { useNavigate } from "react-router-dom";
import { add_value } from "../../utils/storage/loggedUserSlice";
import AxiosResponseErrors from "../../utils/customeErrors/axiosResponse";
import { update_toastes_trigger_value } from "../../utils/storage/toastesTriggersSlice";
import {
  check_login,
  force_password_change,
} from "../../utils/navigationRules/navigationRulesCheck";

export default function EditPasswordForm() {
  const navigate = useNavigate();
  const [old_passowrd, set_old_passowrd] = useState("");
  const [new_password, set_new_password] = useState("");
  const [password_confirmation, set_password_confirmation] = useState("");

  const dispatch = useDispatch();
  let logged_user_info = useSelector((state) => state.loggedUser.value);

  useEffect(() => {
    console.log(logged_user_info.user_information.password_generated);
    if (!check_login(logged_user_info)) {
      navigate("/login");
    }
  }, []);

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
      } else if ([401].includes(custom_error.status_code)) {
        toast.error(`Your session has expired. We are redirecting you to the login page.`, {
          style: {
            borderRadius: "10px",
            background: "#333",
            color: "#fff",
          },
          autoClose: 4000,
        });

        await dispatch(
          add_value({
            user_token: "",
            user_id: "",
            user_contacts: [],
            user_information: "",
          })
        );

        setTimeout(() => {
          navigate("/");
        }, 3000);
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
  };

  const handle_api_requests = async () => {
    return new Promise(async (resolve, reject) => {
      const exec_result = await exec_patch_password(
        logged_user_info.user_id,
        password_confirmation,
        new_password,
        old_passowrd,
        logged_user_info.user_token
      );


      console.log("exec result",exec_result)

      if (exec_result.resp_code === 200) {
        //Todo - > validate this process
        const user_info = await exec_get_user_info(
          logged_user_info.user_id,
          logged_user_info.user_token
        );
        if (user_info.resp_code !== 200) {
          reject(new AxiosResponseErrors(500, []));
        }

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
        console.log()
        const array_of_errors = exec_result.data.process_result;
        reject(new AxiosResponseErrors(exec_result.resp_code, array_of_errors));
      } else {
        reject(new AxiosResponseErrors(exec_result.resp_code, []));
      }
    });
  };

  return (
    <div>
      {logged_user_info.user_information.password_generated ? (
        <div>
          <p>
            Kindly update your automatically generated password to a
            personalized one, this action is mandatory!
          </p>
          <p>
            {" "}
            When you complete this task, additional functionalities will be
            unlocked.
          </p>
        </div>
      ) : (
        <div></div>
      )}

      <div className="container-fluid  d-flex justify-content-start align-items-center flex-row">
        <button
          className="btn btn-outline-secondary mr-2"
          disabled={
            logged_user_info.user_information.password_generated ? true : false
          }
          onClick={function () {
            navigate("/");
          }}
        >
          GO HOME
        </button>

        <p style={{ padding: "10px 0px", margin: "0px 0px 0px 10px" }}>
          /dasboard/password/update
        </p>
      </div>

      <div className="relative d-flex flex-column container text-center">
        <div className="p-5 rounded gradiant_background justify-content-center align-items-center mt-5">
          <h2>EDIT PASSWORD FORM</h2>
          <form onSubmit={handle_submit}>
            <div className="custom_input-group">
              <input
                className="custom_input"
                id="new_password"
                placeholder="New Password:"
                type="password"
                value={new_password}
                onChange={handle_new_password_change}
                required
              />
            </div>
            <br />

            <div className="custom_input-group">
              <input
                className="custom_input"
                id="confirm_password"
                placeholder="Confirm password:"
                type="password"
                value={password_confirmation}
                onChange={handle_password_confirmation_change}
                required
              />
            </div>

            <br />

            <div className="custom_input-group">
              <input
                className="custom_input"
                id="old_password"
                placeholder="Old password:"
                type="password"
                value={old_passowrd}
                onChange={handle_old_password_change}
                required
              />
            </div>
            <button className="btn btn-light mt-4" type="submit">
              UPDATE PASSWORD
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}
