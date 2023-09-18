import React, { useEffect, useState } from "react";
import Contact from "./contact";
import toast from "react-hot-toast";
import { useNavigate } from "react-router-dom";
import {
  exec_delete_user_contact,
  exec_update_user_contact,
} from "../../utils/api/contacts/contactController";
import { useSelector, useDispatch } from "react-redux";
import { add_value } from "../../utils/storage/loggedUserSlice";
import NewContactForm from "./newContactForm";

const ContactList = () => {
  const dispatch = useDispatch();
  const [contacts_array, set_contacts] = useState([]);
  let logged_user_info = useSelector((state) => state.loggedUser.value);
  const navigate = useNavigate();
  useEffect(() => {
    set_contacts(logged_user_info.user_contacts);
  }, []);

  const update_contact = async (values) => {



    
    // const values = id.split("//");
    // newValues.old_phone_numb = values[1];
    // newValues.old_email = values[2];

    // console.log("inside update", values);

    // const exec_result = await exec_update_user_contact(
    //   values[0],
    //   values[1],
    //   logged_user_info.user_id,
    //   logged_user_info.user_token
    // );

    // set_contacts((prev) =>
    //   prev.map((item) => (item.id === todoId ? newValue : item))
    // );

  };



  const move_home = () => {
    navigate("/");
  };


  const remove_contact = async (id, index) => {
    const values = id.split("//");
    console.log(values);

    const exec_result = await exec_delete_user_contact(
      values[0],
      values[1],
      logged_user_info.user_id,
      logged_user_info.user_token
    );
    if (exec_result.resp_code < 300) {
      const new_array = contacts_array.filter((item) => {
        // Define your conditions using logical operators
        return item.email !== values[0] && item.phone_number !== values[0];
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
    } else if (exec_result.resp_code >= 400) {
      const array_of_errors = exec_result.data.process_result;

      if (array_of_errors.data.process_result.length()) {
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
        toast.error(`${exec_result.message} `, {
          style: {
            borderRadius: "10px",
            background: "#333",
            color: "#fff",
            duration: 2000,
          },
        });
      }
    } else {
      toast.error(`${exec_result.message} `, {
        style: {
          borderRadius: "10px",
          background: "#333",
          color: "#fff",
          duration: 2000,
        },
      });
    }
  };

  return (
    <div>
      <h1>Here is your List of contacts</h1>
      {/* <TodoForm onSubmit={addTodo} /> */}

      <Contact
        contacts={contacts_array}
        update_contact={update_contact}
        remove_contact={remove_contact}
      />

      <NewContactForm set_contacts={set_contacts} contacts={contacts_array} />

      <button className="btn btn btn-outline-secondary mr-2" onClick={move_home}>GO BACK</button>
    </div>
  );
};

export default ContactList;
