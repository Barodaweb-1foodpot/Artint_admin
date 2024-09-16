import axios from "axios";

export const getUserShippingAddress = async (_id) => {
  return await axios.get(
    `${process.env.REACT_APP_API_URL_COFFEE}/api/auth/get/userShippingAddress/${_id}`
  );
};
