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


export default function ManageProfile() {

  const navigate = useNavigate();
  let logged_user_info = useSelector((state) => state.loggedUser.value);
  const dispatch = useDispatch();
  const submite_update =  async (values) => {

    
    const exec_result = await exec_update_user(
      values.user_id,
      values.full_name,
      values.locality,
      values.age,
      values.phone_numb,
      logged_user_info.user_token
    )

    if (exec_result.resp_code < 300) {
      const user_info = await exec_get_user_info(
        logged_user_info.user_id,
        logged_user_info.user_token
      );



      await dispatch(
        add_value({
          user_token: logged_user_info.user_token,
          user_id: logged_user_info.user_id,
          user_contacts: logged_user_info.user_contacts,
          user_information:user_info.data.process_result.user,
        })
      );

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
    set_edit({
      id: null,
      value: "",
    });
  };

  const on_cancel =  async (values) => {
    const exec_result = await exec_update_user(
      values.user_id,
      values.full_name,
      values.locality,
      values.age,
      values.phone_numb,
      logged_user_info.user_token
    )



    if (exec_result.resp_code < 300) {
  
      let updated_logged_user_info = logged_user_info.user_information;
      updated_logged_user_info.phone_numb = values.phone_numb
      updated_logged_user_info.full_name =values.full_name
      updated_logged_user_info.age =values.age
      updated_logged_user_info.locality =values.locality
      
      await dispatch(
        add_value({
          user_token: logged_user_info.user_token,
          user_id: logged_user_info.user_id,
          user_contacts: logged_user_info.user_contacts,
          user_information:updated_logged_user_info,
        })
      );
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

    set_edit({
      id: null,
      value: "",
    });
  };
  const [edit, set_edit] = useState({
    id: null,
    value: "",
  });

  if (edit.id) {
    return <EditProfileForm initial_name={edit.value.full_name}  initial_locality={edit.value.locality} initial_phone_numb={edit.value.phone_numb}  initial_age = {edit.value.age} on_submit={submite_update} on_cancel={on_cancel} user_id= {edit.id}  />;
  }


  const move_home = () => {
    navigate("/");
  };

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
