import React, { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import {
  check_login,
  force_password_change,
} from "../utils/navigationRules/navigationRulesCheck";
import { useSelector, useDispatch } from "react-redux";
import { add_value } from "../utils/storage/loggedUserSlice";
export default function DashboardHome() {
  const dispatch = useDispatch();
  let logged_user_info = useSelector((state) => state.loggedUser.value);
  const navigate = useNavigate();

  const move_to_profile = () => {
    navigate("/profile");
  };
  const move_to_password_manager = () => {
    navigate("/manage/password");
  };

  const move_to_contact_dashboard = () => {
    navigate("/contacts");
  };

  const log_out = async () => {
    await dispatch(
      add_value({
        user_token: "",
        user_id: "",
        user_contacts: [],
        user_information: "",
      })
    );

    navigate("/login");
  };

  useEffect(() => {
    if (!check_login(logged_user_info)) {
      navigate("/login");
    }
    if (force_password_change(logged_user_info)) {
      navigate("/manage/password");
    }
  }, []);

  return (
    <>
      <div className="container-fluid  d-flex justify-content-start align-items-center flex-row">
        <button
          className="btn btn-outline-secondary mr-2"
          onClick={function () {
            log_out();
          }}
        >
          LOG OUT
        </button>

        <p style={{ padding: "10px 0px", margin: "0px 0px 0px 10px" }}>
          /dashboard
        </p>
      </div>
      <div
        className="d-flex justify-content-center align-items-center"
        style={{ height: "100vh" }}
      >
        <div className="text-center">
          <h1 className="">WELCOME TO THE DASHBOARD</h1>
          <p className="">
            This is our app dashboard please select one of the option bellow:
          </p>
          <div className="d-flex justify-content-between">
            <button
              className="btn btn-outline-secondary mr-2"
              onClick={move_to_profile}
            >
              MY PROFILE
            </button>
            <button
              className="btn btn-outline-secondary mr-2"
              onClick={move_to_password_manager}
            >
              PASSWORD
            </button>
            <button
              className="btn btn btn-outline-secondary mr-2"
              onClick={move_to_contact_dashboard}
            >
              MY CONTACTS
            </button>
          </div>
        </div>
      </div>
    </>
  );
}
