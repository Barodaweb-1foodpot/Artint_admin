import axios from "axios";

export const createDrinkCategory = async (values) => {
  return await axios.post(
    `${process.env.REACT_APP_API_URL}/api/auth/create/drink-category`,
    values
  );
};

export const removeDrinkCategory = async (_id) => {
  return await axios.delete(
    `${process.env.REACT_APP_API_URL}/api/auth/remove/drink-category/${_id}`
  );
};

export const listDrinkCategory = async () => {
  return await axios.get(
    `${process.env.REACT_APP_API_URL}/api/auth/list/drink-category`
  );
};

export const updateDrinkCategory = async (_id, values) => {
  return await axios.put(
    `${process.env.REACT_APP_API_URL}/api/auth/update/drink-category/${_id}`,
    values
  );
};

export const getDrinkCategory = async (_id) => {
  return await axios.get(
    `${process.env.REACT_APP_API_URL}/api/auth/get/drink-category/${_id}`
  );
};
