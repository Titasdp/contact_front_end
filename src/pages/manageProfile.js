import React, { useState } from "react";
import {
  exec_get_user_info,
  exec_update_user,
} from "../utils/api/users/usersController";
import { useSelector, useDispatch } from "react-redux";
import toast from "react-hot-toast";
import { useNavigate } from "react-router-dom";
import { add_value } from "../utils/storage/loggedUserSlice";
import { TiEdit } from "react-icons/ti";
import EditProfileForm from "../components/profile/editProfileForm";
import AxiosResponseErrors from "../utils/customeErrors/axiosResponse";

export default function ManageProfile() {
  const navigate = useNavigate();
  const [submit_running, set_submit_running] = useState(false);
  const dispatch = useDispatch();
  let logged_user_info = useSelector((state) => state.loggedUser.value);

  const submite_update = async (values) => {
    try {
      set_submit_running(true);
      await toast.promise(handle_api_requests(values), {
        loading: "Updating...",
        success: (message) => {
          return message;
        },
        error: (error) => {
          return "Update profile process failed";
        },
      });
 
      set_edit({
        id: null,
        value: "",
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


    set_submit_running(false);
  };


  const on_cancel = async () => {
    set_edit({
      id: null,
      value: "",
    });
  };

  const handle_api_requests = async (values) => {
    return new Promise(async (resolve, reject) => {
      await setTimeout(async () => {
        const exec_result = await exec_update_user(
          values.user_id,
          values.full_name,
          values.locality,
          values.age,
          values.phone_numb,
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


  const move_home = () => {
    navigate("/");
  };

  const [edit, set_edit] = useState({
    id: null,
    value: "",
  });

  if (edit.id) {
    return (
      <EditProfileForm
        initial_name={edit.value.full_name}
        initial_locality={edit.value.locality}
        initial_phone_numb={edit.value.phone_numb}
        initial_age={edit.value.age}
        on_submit={submite_update}
        on_cancel={on_cancel}
        user_id={edit.id}
        submit_running = {submit_running}
        set_submit_running = {set_submit_running}
      />
    );
  }

  return (
    <div>
      <div className="container mt-5">
        <div className="card">
          <h1>USER PROFILE</h1>

          <p className="">
            <strong>Email :</strong>
            {logged_user_info.user_information.full_name}
          </p>
          <p className="">
            {" "}
            <strong>Email :</strong>
            {logged_user_info.user_information.email}
          </p>
          <p className="">
            <strong>Locality :</strong>
            {logged_user_info.user_information.locality}
          </p>
          <p className="">
            <strong>Age :</strong>
            {logged_user_info.user_information.age}
          </p>

          <p className="">
            <strong>Phone Number :</strong>
            {logged_user_info.user_information.phone_numb}
          </p>

          <div className="icons">
            <TiEdit
              onClick={() =>
                set_edit({
                  id: `${logged_user_info.user_id}`,
                  value: {
                    phone_numb: logged_user_info.user_information.phone_numb,
                    full_name: logged_user_info.user_information.full_name,
                    locality: logged_user_info.user_information.locality,
                    age: logged_user_info.user_information.age,
                  },
                })
              }
              className="edit-icon"
            />
          </div>

          <button onClick={move_home}>GO BACK</button>
        </div>
      </div>
    </div>
  );
}
