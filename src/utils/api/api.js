import axios from "axios";

const url = "http://127.0.0.1:8001";

export const execute_request = async (
  access_token,
  body,
  url_sufix,
  request_type
) => {
  axios.defaults.headers.common["Authorization"] = "Bearer " + access_token;
  axios.defaults.headers.common["Content-Type"] =
    "application/x-www-form-urlencoded";
  try {
    let response = null;
    if (request_type === "post") {
      response = await axios.post(url + url_sufix, body);
    }
    if (request_type === "get") {
      response = await axios.get(url + url_sufix, body);
    }
    if (request_type === "delete") {
      response = await axios.delete(url + url_sufix, body);
    }

    if (request_type === "put") {
      response = await axios.put(url + url_sufix, body);
    }
    if (request_type === "patch") {
      response = await axios.patch(url + url_sufix, body);
    }

    return {
      resp_code: response.status,
      data: response.data,
    };
  } catch (error) {
    if (error.code === "ERR_NETWORK") {
      return {
        resp_code: 500,
        data: [],
      };
    }
    return {
      resp_code: error.response.status,
      data: error.response.data,
    };
  }
};
