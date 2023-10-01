import React, { useEffect, useState } from "react";
import Contact from "./contact";
import toast from "react-hot-toast";
import { useNavigate } from "react-router-dom";
import {
  exec_delete_user_contact,
  exec_update_user_contact,
  exec_get_user_contacts,
} from "../../utils/api/contacts/contactController";
import { useSelector, useDispatch } from "react-redux";
import { add_value } from "../../utils/storage/loggedUserSlice";
import NewContactForm from "./newContactForm";
import ContactForm from "./contactForm";
import AxiosResponseErrors from "../../utils/customeErrors/axiosResponse";

const ContactList = () => {
  const dispatch = useDispatch();
  const [contacts_array, set_contacts] = useState([]);
  const [edit, set_edit] = useState({
    id: null,
    value: "",
  });

  let logged_user_info = useSelector((state) => state.loggedUser.value);
  const navigate = useNavigate();

  const move_home = () => {
    navigate("/");
  };

  useEffect(() => {
    set_contacts(logged_user_info.user_contacts);
  }, []);

  const update_contact = async (values) => {
    try {
      await toast.promise(handle_api_request_edit_contact(values), {
        loading: "Updating contact...",
        success: (message) => {
          set_edit({
            id: null,
            value: "",
          });
          return message;
        },
        error: (error) => {
          return "Failed to update contact";
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

  const remove_contact = async (id, index) => {
    try {
      await toast.promise(handle_api_request_remove_contact(id), {
        loading: "Updating...",
        success: (message) => {
          return message;
        },
        error: (error) => {
          return "Contact removed failed";
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

  const handle_api_request_remove_contact = async (id) => {
    const id_combination = id.split("//");
    return new Promise(async (resolve, reject) => {
      await setTimeout(async () => {
        const exec_result = await exec_delete_user_contact(
          id_combination[0],
          id_combination[1],
          logged_user_info.user_id,
          logged_user_info.user_token
        );

        if (exec_result.resp_code === 200) {
          //Todo - > validate this process
          const new_array = contacts_array.filter((item) => {
            // Define your conditions using logical operators
            return (
              item.email !== id_combination[0] &&
              item.phone_number !== id_combination[0]
            );
          });
          await dispatch(
            add_value({
              user_token: logged_user_info.user_token,
              user_id: logged_user_info.user_id,
              user_contacts: new_array,
              user_information: logged_user_info.user_information,
            })
          );

          set_contacts(new_array);

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

  const handle_api_request_edit_contact = async (values) => {
    return new Promise(async (resolve, reject) => {
      await setTimeout(async () => {
        const exec_result = await exec_update_user_contact(
          values.old_email,
          values.old_phone_numb,
          values.email,
          values.full_name,
          values.locality,
          values.obs,
          values.phone_numb,
          values.address,
          logged_user_info.user_id,
          logged_user_info.user_token
        );

        if (exec_result.resp_code === 200) {
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
        } else {
          // Error page must be added
        }
      }, 1000);
    });
  };

  if (edit.id) {
    return (
      <ContactForm
        initial_name={edit.value.full_name}
        initial_email={edit.value.email}
        initial_locality={edit.value.locality}
        initial_address={edit.value.address}
        initial_phone_numb={edit.value.phone_numb}
        initial_obs={edit.value.obs}
        on_submit={update_contact}
        id={edit.id}
      />
    );
  }

  return (
    <div>
      <h1>List of Contacts</h1>
      {/* <TodoForm onSubmit={addTodo} /> */}

      <div className="container scrolling-wrapper">
        <div className="table-wrapper">
          <table class="table table-bordered">
            <thead>
              <tr>
                <th>Email</th>
                <th>Phone</th>
                <th>Name</th>
                <th>Locality</th>
                <th>Address</th>
                <th>Obs</th>
                <th>Delete</th>
                <th>Update</th>
              </tr>
            </thead>
            <tbody>
              <Contact
                contacts={contacts_array}
                update_contact={update_contact}
                remove_contact={remove_contact}
                set_edit={set_edit}
              />
            </tbody>
          </table>
        </div>
      </div>

      <NewContactForm set_contacts={set_contacts} contacts={contacts_array} />

      <button
        className="btn btn btn-outline-secondary mr-2"
        onClick={move_home}
      >
        GO BACK
      </button>
    </div>
  );
};

export default ContactList;
