import axios from "axios";

export const createCountry = async (values) => {
  return await axios.post(
    `${process.env.REACT_APP_API_URL}/api/auth/location/country`,
    values,
    {
      headers: {
        "Content-Type": "application/json",
      },
    }
  );
};

export const listCountry = async () => {
  return await axios.get(
    `${process.env.REACT_APP_API_URL}/api/auth/location/country`
  );
};

export const removeCountry = async (_id) => {
  return await axios.delete(
    `${process.env.REACT_APP_API_URL}/api/auth/location/country/${_id}`
  );
};

export const removeAndUpdateCountry = async (_id) => {
  return await axios.put(
    `${process.env.REACT_APP_API_URL}/api/auth/location/country/${_id}`
  );
};

export const updateCountry = async (_id, values) => {
  return await axios.put(
    `${process.env.REACT_APP_API_URL}/api/auth/location/countryupdate/${_id}`,
    values
  );
};

export const getCountry = async (_id) => {
  return await axios.get(
    `${process.env.REACT_APP_API_URL}/api/auth/location/country/${_id}`
  );
};

// ////////////////////////////////////////STATE//////////////////////////////

export const createState = async (values) => {
  return await axios.post(
    `${process.env.REACT_APP_API_URL}/api/auth/location/state`,
    values
  );
};

export const removeState = async (_id) => {
  return await axios.delete(
    `${process.env.REACT_APP_API_URL}/api/auth/location/state/${_id}`
  );
};

export const listState = async () => {
  return await axios.get(
    `${process.env.REACT_APP_API_URL}/api/auth/location/state`
  );
};

export const removeAndUpdatState = async (_id) => {
  return await axios.put(
    `${process.env.REACT_APP_API_URL}/api/auth/location/state/${_id}`
  );
};

export const updateState = async (_id, values) => {
  return await axios.put(
    `${process.env.REACT_APP_API_URL}/api/auth/location/stateupdate/${_id}`,
    values
  );
};

export const getState = async (_id) => {
  return await axios.get(
    `${process.env.REACT_APP_API_URL}/api/auth/location/state/${_id}`
  );
};

// ////////////////////////////////////////CITY//////////////////////////////

export const createCity = async (values) => {
  return await axios.post(
    `${process.env.REACT_APP_API_URL}/api/auth/location/city`,
    values
  );
};

export const listCity = async () => {
  return await axios.get(
    `${process.env.REACT_APP_API_URL}/api/auth/location/city`
  );
};

export const removeCity = async (_id) => {
  return await axios.delete(
    `${process.env.REACT_APP_API_URL}/api/auth/location/city/${_id}`
  );
};

export const removeAndUpdateCity = async (_id) => {
  return await axios.put(
    `${process.env.REACT_APP_API_URL}/api/auth/location/city/${_id}`
  );
};

export const getCity = async (_id) => {
  return await axios.get(
    `${process.env.REACT_APP_API_URL}/api/auth/location/city/${_id}`
  );
};

export const updateCity = async (_id, values) => {
  return await axios.put(
    `${process.env.REACT_APP_API_URL}/api/auth/location/city/${_id}`,
    values
  );
};
