import { execute_request } from "../api";

export const exec_get_user_contacts = async (user_id, token) => {
  const result = await execute_request(
    token,
    {},
    `/users/${user_id}/contacts`,
    "get"
  );

  return result;
};

export const exec_add_user_contact = async (
  email,
  full_name,
  locality,
  obs,
  phone_numb,
  address,
  user_id,
  token
) => {
  const exec_result = await execute_request(
    token,
    {
      full_name: full_name,
      locality: locality,
      email: email,
      obs: obs,
      phone_numb: phone_numb,
      address: address,
    },
    `/users/${user_id}/contacts`,
    "post"
  );
  return exec_result;
};

export const exec_delete_user_contact = async (
  email,
  phone_numb,
  user_id,
  token
) => {
  const exec_result = await execute_request(
    token,
    {},
    `/users/${user_id}/contacts/${email}/${phone_numb}`,
    "delete"
  );
  return exec_result;
};

export const exec_update_user_contact = async (
    old_email,
    old_phone_numb,
    email,
    full_name,
    locality,
    obs,
    phone_numb,
    address,
    user_id,
    token
) => {
    const exec_result = await execute_request(
      token,
      {
        full_name: full_name,
        locality: locality,
        email: email,
        obs: obs,
        phone_numb: phone_numb,
        address: address,
      },
      `/users/${user_id}/contacts/${old_email}/${old_phone_numb}`,
      "put"
    );
    return exec_result;
};
