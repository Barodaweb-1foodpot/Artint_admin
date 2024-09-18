import axios from "axios";

export const createProductsDetails = async (values) => {
  return await axios.post(
    `${process.env.REACT_APP_API_URL}/api/auth/create/product-details`,
    values
  );
};

export const removeProductsDetails = async (_id) => {
  return await axios.delete(
    `${process.env.REACT_APP_API_URL}/api/auth/remove/product-details/${_id}`
  );
};

export const listProductsDetails = async () => {
  return await axios.get(
    `${process.env.REACT_APP_API_URL}/api/auth/list/product-details`
  );
};

export const updateProductsDetails = async (_id, values) => {
  return await axios.put(
    `${process.env.REACT_APP_API_URL}/api/auth/update/product-details/${_id}`,
    values
  );
};

export const getProductsDetails = async (_id) => {
  return await axios.get(
    `${process.env.REACT_APP_API_URL}/api/auth/get/product-details/${_id}`
  );
};
