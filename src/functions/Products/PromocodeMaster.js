import axios from "axios";

export const createPromocodeMaster = async (values) => {
  return await axios.post(
    `${process.env.REACT_APP_API_URL_COFFEE}/api/auth/create/PromocodeMaster`,
    values
  );
};

export const removePromocodeMaster = async (_id) => {
  return await axios.delete(
    `${process.env.REACT_APP_API_URL_COFFEE}/api/auth/remove/PromocodeMaster/${_id}`
  );
};

export const listPromocodeMaster = async () => {
  return await axios.get(
    `${process.env.REACT_APP_API_URL_COFFEE}/api/auth/list/PromocodeMaster`
  );
};

export const updatePromocodeMaster = async (_id, values) => {
  return await axios.put(
    `${process.env.REACT_APP_API_URL_COFFEE}/api/auth/update/PromocodeMaster/${_id}`,
    values
  );
};

export const getPromocodeMaster = async (_id) => {
  return await axios.get(
    `${process.env.REACT_APP_API_URL_COFFEE}/api/auth/get/PromocodeMaster/${_id}`
  );
};
