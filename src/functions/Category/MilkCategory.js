import axios from "axios";

export const createMilkCategory = async (values) => {
  return await axios.post(
    `${process.env.REACT_APP_API_URL}/api/auth/create/milk-category`,
    values
  );
};

export const removeMilkCategory = async (_id) => {
  return await axios.delete(
    `${process.env.REACT_APP_API_URL}/api/auth/remove/milk-category/${_id}`
  );
};

export const listMilkCategory = async () => {
  return await axios.get(
    `${process.env.REACT_APP_API_URL}/api/auth/list/milk-category`
  );
};

export const updateMilkCategory = async (_id, values) => {
  return await axios.put(
    `${process.env.REACT_APP_API_URL}/api/auth/update/milk-category/${_id}`,
    values
  );
};

export const getMilkCategory = async (_id) => {
  return await axios.get(
    `${process.env.REACT_APP_API_URL}/api/auth/get/milk-category/${_id}`
  );
};
