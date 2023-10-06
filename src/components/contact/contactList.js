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
import {
  check_login,
  force_password_change,
} from "../../utils/navigationRules/navigationRulesCheck";

const ContactList = () => {
  let logged_user_info = useSelector((state) => state.loggedUser.value);
  const dispatch = useDispatch();
  let [contacts_array, set_contacts] = useState(logged_user_info.user_contacts);

  //Pagination related Variables
  const items_per_page = 10;
  let [current_page, set_current_page] = useState(1);
  let [total_pages, set_total_pages] = useState(
    Math.ceil(contacts_array.length / items_per_page)
  );
  let [start_list_index, set_start_list_index] = useState(
    (current_page - 1) * items_per_page
  );
  let [end_list_index, set_end_list_index] = useState(
    Math.min(start_list_index + items_per_page - 1, contacts_array.length - 1)
  );
  const [edit, set_edit] = useState({
    id: null,
    value: "",
  });
  //Search_related
  const [search_name_Query, set_search_query] = useState("");

  const handle_name_change = (event) => {
    set_search_query(event.target.value);
  };

  const navigate = useNavigate();

  const move_home = () => {
    navigate("/");
  };

  //Define my useEffects
  useEffect(() => {
    const startIndex = (current_page - 1) * items_per_page;
    const endIndex = Math.min(
      startIndex + items_per_page - 1,
      contacts_array.length - 1
    );
    set_start_list_index(startIndex);
    set_end_list_index(endIndex);
    set_total_pages(Math.ceil(contacts_array.length / items_per_page));
  }, [current_page, contacts_array]);

  useEffect(() => {
    if (!check_login(logged_user_info)) {
      navigate("/login");
    }
    if (force_password_change(logged_user_info)) {
      navigate("/manage/password");
    }
  });

  const handle_page_change = async (increment) => {
    const newPage = current_page + increment;
    if (newPage >= 1 && newPage <= total_pages) {
      await set_current_page(newPage);
    }
  };

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

  const on_cancel = async () => {
    set_edit({
      id: null,
      value: "",
    });
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

  const handle_api_request_remove_contact = async (id) => {
    const id_combination = id.split("//");
    return new Promise(async (resolve, reject) => {
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
            item.phone_number !== id_combination[1]
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
        reject(new AxiosResponseErrors(exec_result.resp_code, array_of_errors));
      } else if (exec_result.resp_code === 401) {
        new AxiosResponseErrors(exec_result.resp_code, []);
      } else {
        new AxiosResponseErrors(exec_result.resp_code, []);
      }
    });
  };

  const handle_api_request_edit_contact = async (values) => {
    return new Promise(async (resolve, reject) => {
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
            user_contacts: get_contact_exec_result.data.process_result.contacts,
            user_information: logged_user_info.user_information,
          })
        );

        set_contacts(get_contact_exec_result.data.process_result.contacts);

        resolve(exec_result.data.message);
      } else if ([400, 422, 404].includes(exec_result.resp_code)) {
        const array_of_errors = exec_result.data.process_result;
        reject(new AxiosResponseErrors(exec_result.resp_code, array_of_errors));
      } else {
        reject(new AxiosResponseErrors(exec_result.resp_code, []));
      }
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
        on_cancel={on_cancel}
      />
    );
  }

  return (
    <>
      <div className="container-fluid  d-flex justify-content-start align-items-center flex-row">
        <button className="btn btn-outline-secondary mr-2" onClick={move_home}>
          GO HOME
        </button>

        <p style={{ padding: "10px 0px", margin: "0px 0px 0px 10px" }}>
          /dashboard/contacts
        </p>
      </div>
      <div className="container-fluid text-center">
        <h2>LIST OF CONTACT</h2>
        <div className="table-wrapper col-md-12 d-flex justify-content-center flex-column">
          <input
            className="custom_input mb-4 custom_input_no_wrapper rounded gradiant_background"
            type="text"
            value={search_name_Query}
            onChange={handle_name_change}
            placeholder="Search contact by name..."
          />
        </div>
        {/* <TodoForm onSubmit={addTodo} /> */}
        <div className="container-fluid scrolling-wrapper">
          <div className="table-wrapper col-md-12 d-flex justify-content-start flex-column">
            <table className="table table-dark text-center">
              <thead className="gradiant_background">
                <tr>
                  <th>EMAIL</th>
                  <th>PHONE</th>
                  <th>NAME</th>
                  <th>LOCALITY</th>
                  <th>ADDRESS</th>
                  <th>OBS</th>
                  <th>DELETE</th>
                  <th>UPDATE</th>
                </tr>
              </thead>
              <tbody>
                <Contact
                  contacts={contacts_array}
                  update_contact={update_contact}
                  remove_contact={remove_contact}
                  set_edit={set_edit}
                  start={start_list_index}
                  end={end_list_index}
                  search_query={search_name_Query}
                />
              </tbody>
            </table>
          </div>
        </div>

        <div className="mt-5">
          <button
            className="btn btn-outline-secondary mr-2"
            onClick={() => handle_page_change(-1)}
            disabled={current_page === 1}
          >
            PREV
          </button>
          <span className="">{` Page ${current_page} of ${total_pages} `}</span>
          <button
            className="btn btn-outline-secondary ml-2"
            onClick={() => handle_page_change(1)}
            disabled={current_page === total_pages}
          >
            NEXT
          </button>
        </div>

        <NewContactForm set_contacts={set_contacts} contacts={contacts_array} />
      </div>
    </>
  );
};

export default ContactList;
