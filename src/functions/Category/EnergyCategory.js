import axios from "axios";

export const createEnergyMaster = async (values) => {
  return await axios.post(
    `${process.env.REACT_APP_API_URL}/api/auth/create/energy-category`,
    values
  );
};

export const removeEnergyMaster = async (_id) => {
  return await axios.delete(
    `${process.env.REACT_APP_API_URL}/api/auth/remove/energy-category/${_id}`
  );
};

export const listEnergyMaster = async () => {
  return await axios.get(
    `${process.env.REACT_APP_API_URL}/api/auth/list/energy-category`
  );
};

export const updateEnergyMaster = async (_id, values) => {
  return await axios.put(
    `${process.env.REACT_APP_API_URL}/api/auth/update/energy-category/${_id}`,
    values
  );
};

export const getEnergyMaster = async (_id) => {
  return await axios.get(
    `${process.env.REACT_APP_API_URL}/api/auth/get/energy-category/${_id}`
  );
};
