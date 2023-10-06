import React, { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import {
  check_login,
  force_password_change,
} from "../utils/navigationRules/navigationRulesCheck";
import { useSelector } from "react-redux";
export default function DashboardHome() {
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

  useEffect(() => {
    if (!check_login(logged_user_info)) {
      navigate("/login");
    }
    if (force_password_change(logged_user_info)) {
      navigate("/manage/password");
    }
  }, []);

  return (
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
  );
}
