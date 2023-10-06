import React, { useState } from "react";
import PhoneInput from "react-phone-number-input";
import { useSelector, useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";
import "react-phone-number-input/style.css";
import {
  exec_add_user_contact,
  exec_get_user_contacts,
} from "../../utils/api/contacts/contactController";
import toast from "react-hot-toast";
import { add_value } from "../../utils/storage/loggedUserSlice";
import AxiosResponseErrors from "../../utils/customeErrors/axiosResponse";

export default function NewContactForm({ set_contacts, contacts }) {
  const navigate = useNavigate();
  const [email, set_email] = useState("");
  const [full_name, set_name] = useState("");
  const [locality, set_locality] = useState("");
  const [address, set_address] = useState("");
  const [phone_numb, set_phone_numb] = useState("");
  const [obs, set_obs] = useState("");
  const dispatch = useDispatch();

  let logged_user_info = useSelector((state) => state.loggedUser.value);

  const handle_change_email = (e) => {
    set_email(e.target.value);
  };

  const handle_change_name = (e) => {
    set_name(e.target.value);
  };

  const handle_change_address = (e) => {
    set_address(e.target.value);
  };
  const handle_change_locality = (e) => {
    set_locality(e.target.value);
  };

  const handle_change_obs = (e) => {
    set_obs(e.target.value);
  };

  const handle_submit = async (e) => {
    e.preventDefault();

    try {
      await toast.promise(handle_api_requests(), {
        loading: "Adding contact...",
        success: (message) => {
          set_email("");
          set_name("");
          set_address("");
          set_locality("");
          set_obs("");
          return message;
        },
        error: (error) => {
          return "Failed to add new contact...";
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
      } else if (custom_error.status_code === 401) {
        toast.error(
          `Your session has expired. We are redirecting you to the login page.`,
          {
            style: {
              borderRadius: "10px",
              background: "#333",
              color: "#fff",
            },
          }
        );
        setTimeout(() => {
          navigate("/");
        }, 2000);
      } else {
        toast.error(`Something went wrong. Please try again.`, {
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
        const exec_result = await exec_add_user_contact(
          email,
          full_name,
          locality,
          obs,
          phone_numb,
          address,
          logged_user_info.user_id,
          logged_user_info.user_token
        );

        if (exec_result.resp_code === 201) {
          //Todo - > validate this process
          const get_contact_exec_result = await exec_get_user_contacts(
            logged_user_info.user_id,
            logged_user_info.user_token
          );

          await dispatch(
            add_value({
              user_token: logged_user_info.user_token,
              user_id: logged_user_info.user_id,
              user_contacts:
                get_contact_exec_result.data.process_result.contacts,
              user_information: logged_user_info.user_information,
            })
          );

          set_contacts(get_contact_exec_result.data.process_result.contacts);

          resolve(exec_result.data.message);
        } else if ([400, 422, 404].includes(exec_result.resp_code)) {
          const array_of_errors = exec_result.data.process_result;
          reject(
            new AxiosResponseErrors(exec_result.resp_code, array_of_errors)
          );
        } else if (exec_result.resp_code === 401) {
          new AxiosResponseErrors(exec_result.resp_code, []);
        } else {
          new AxiosResponseErrors(exec_result.resp_code, []);
        }
      }, 1000);
    });
  };

  return (
    <div className="relative d-flex  flex-column container text-center">
      <div className="p-5 rounded gradiant_background justify-content-center align-items-center mt-5">
        <h2 className="title">ADD NEW CONTACT</h2>
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
              id="full_name"
              placeholder="Full Name:"
              type="text"
              value={full_name}
              onChange={handle_change_name}
              required
            />
          </div>
          <br />
          <div className="custom_input-group">
            <input
              className="custom_input"
              placeholder="Locality:"
              id="locality"
              type="text"
              value={locality}
              onChange={handle_change_locality}
              required
            />
          </div>
          <br />

          <div className="custom_input-group">
            <input
              className="custom_input"
              placeholder="Address"
              id="address"
              type="text"
              value={address}
              onChange={handle_change_address}
              required
            />
          </div>
          <br />
          <div className="custom_input_for_text_area">
            <textarea
              className="custom_text-area"
              placeholder="Enter an observation"
              id="obs"
              value={obs}
              onChange={handle_change_obs}
              required
            />
          </div>
          <br />

          <div className="custom_input-group">
            <PhoneInput
              className="d-flex flex-row"
              placeholder="Enter phone number"
              value={phone_numb}
              onChange={set_phone_numb}
              required
            />
          </div>

          <button type="submit" className="btn btn-light mt-4">
            CREATE CONTACT
          </button>
        </form>
      </div>
    </div>
  );
}
