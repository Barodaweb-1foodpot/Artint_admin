import axios from "axios";

export const createUsers = async (values) => {
    return await axios.post(
      `${process.env.REACT_APP_API_URL_COFFEE}/api/auth/create/users`,
      values
    );
  };
  
  export const removeUsers = async (_id) => {
    return await axios.delete(
      `${process.env.REACT_APP_API_URL_COFFEE}/api/auth/remove/users/${_id}`
    );
  };
  
  export const listUsers = async () => {
    return await axios.get(
      `${process.env.REACT_APP_API_URL_COFFEE}/api/auth/list/users`
    );
  };
  
  
  export const updateUsers = async (_id, values) => {
    return await axios.put(
      `${process.env.REACT_APP_API_URL_COFFEE}/api/auth/update/users/${_id}`,
      values
    );
  };
  
  export const getUsers = async (_id) => {
    return await axios.get(
      `${process.env.REACT_APP_API_URL_COFFEE}/api/auth/get/users/${_id}`
    );
  };
  