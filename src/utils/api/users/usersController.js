import { execute_request } from "../api";

export const exec_login_user = async (email, password) => {
  const token = "";

  const result = await execute_request(
    token,
    {
      password: password,
      email: email,
    },
    "/users/login",
    "post"
  );

  return result;
};

export const exec_register_user = async (
  email,
  full_name,
  locality,
  age,
  phone_numb
) => {
  const token = "";
  const exec_result = await execute_request(
    token,
    {
      full_name: full_name,
      locality: locality,
      email: email,
      age: age,
      phone_numb: phone_numb,
    },
    "/users/register",
    "post"
  );
  return exec_result;
};

export const exec_get_user_info = async (user_id, token) => {
  const result = await execute_request(token, {}, `/users/${user_id}`, "get");

  return result;
};

export const exec_update_user = async (
  user_id,
  full_name,
  locality,
  age,
  phone_numb,
  token
) => {
  const exec_result = await execute_request(
    token,
    {
      full_name: full_name,
      locality: locality,
      age: age,
      phone_numb: phone_numb,
    },
    `/users/${user_id}/information`,
    "put"
  );
  return exec_result;
};

export const exec_patch_password = async (
  user_id,
  password_confirmation,
  new_password,
  old_passowrd,
  token
) => {


  const exec_result = await execute_request(
    token,
    {
      password_confirmation: password_confirmation,
      old_passowrd: old_passowrd,
      new_password: new_password,
    },
    `/users/${user_id}/password`,
    "patch"
  );
  return exec_result;
};
