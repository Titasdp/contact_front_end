import React, { useState, useEffect } from "react";
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
import { update_toastes_trigger_value } from "../utils/storage/toastesTriggersSlice";
import {
  force_password_change,
  check_login,
} from "../utils/navigationRules/navigationRulesCheck";

export default function ManageProfile() {
  let logged_user_info = useSelector((state) => state.loggedUser.value);
  const navigate = useNavigate();
  const [submit_running, set_submit_running] = useState(false);
  const dispatch = useDispatch();

  const update_toastes_triggers = async (
    user_expire_trigger,
    forced_password_change_trigger,
    forced_loggin_trigger
  ) => {
    await dispatch(
      update_toastes_trigger_value({
        user_expire_trigger: user_expire_trigger,
        forced_password_change_trigger: forced_password_change_trigger,
        forced_loggin_trigger: forced_loggin_trigger,
      })
    );
  };

  useEffect(() => {
    if (!check_login(logged_user_info)) {
      update_toastes_triggers(false, false, true);
      navigate("/login");
    }

    if (force_password_change(logged_user_info)) {
      navigate("/manage/password");
    }
  }, []);

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
        toast.error(`Your session has expired. Please log in again.`, {
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
        }, 2000);
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
        const array_of_errors = exec_result.data.process_result;
        reject(new AxiosResponseErrors(exec_result.resp_code, array_of_errors));
      } else {
        reject(new AxiosResponseErrors(exec_result.resp_code, []));
      }
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
        submit_running={submit_running}
        set_submit_running={set_submit_running}
      />
    );
  }

  return (
    <>
      <div className="container-fluid  d-flex justify-content-start align-items-center flex-row">
        <button
          className="btn btn-outline-secondary mr-2"
          onClick={function () {
            move_home();
          }}
        >
          GO HOME
        </button>

        <p style={{ padding: "10px 0px", margin: "0px 0px 0px 10px" }}>
          /dashboard/profile
        </p>
      </div>

      <div className="relative d-flex flex-column container text-center">
        <div className="p-5 rounded gradiant_background justify-content-center align-items-center mt-5">
          <h2>USER PROFILE</h2>

          <p className="profile_info_line">
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

          <p className="icons">
            <strong>Edit profile :</strong>
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
              className="profile_edit_svg"
            />
          </p>
        </div>
      </div>
    </>
  );
}
