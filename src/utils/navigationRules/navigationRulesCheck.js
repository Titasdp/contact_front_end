export const check_login = (logged_user_info) => {
  if (
    logged_user_info.user_id &&
    logged_user_info.user_token &&
    logged_user_info.user_information
  ) {
    return true;
  }
  return false;
};

export const force_password_change = (logged_user_info) => {
  if (logged_user_info.user_information.password_generated) {
    return true;
  }
  return false;
};