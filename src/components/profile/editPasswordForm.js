import React, { useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import {
    exec_patch_password,
    exec_get_user_info, } from "../../utils/api/users/usersController";
import toast from "react-hot-toast";
import { useNavigate } from "react-router-dom";
import { add_value } from "../../utils/storage/loggedUserSlice";


  
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

  
      const exec_result = await exec_patch_password(logged_user_info.user_id,password_confirmation, new_password,old_passowrd);
  
      if (exec_result.resp_code < 300) {
    

        const user_info = await exec_get_user_info(
          exec_result.data.process_result.user_id,
          exec_result.data.process_result.token
        );
  
        await dispatch(
          add_value({
            user_token: logged_user_info.user_token,
            user_id: logged_user_info.user_id,
            user_contacts: logged_user_info.user_contacts,
            user_information:user_info.data.process_result.userr,
          })
        );
        setTimeout(() => {
          navigate("/"); // Redirect to the login page after the delay
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
  
      console.log(logged_user_info);
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
          <button type="submit">Login</button>
        </form>
  
        <button>GO BACK</button>
      </div>
    );
 
}
