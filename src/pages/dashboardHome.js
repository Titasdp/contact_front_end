import React from "react";
import { useNavigate } from "react-router-dom";

export default function DashboardHome() {
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
