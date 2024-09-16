import axios from "axios";

export const listCompanynDetails = async () => {
    return await axios.get(`${process.env.REACT_APP_API_URL_COFFEE}/api/auth/list/companyDetails`);
};

export const createCompanyDetails = async (values) => {
    return await axios.post(`${process.env.REACT_APP_API_URL_COFFEE}/api/auth/create/companyDetails`, values);
};

export const CompanyFileUpload = async(values)=>{
  return await axios.post(`${process.env.REACT_APP_API_URL_COFFEE}/api/auth/upload/companyDetails`, values)
}

export const updateDetails = async (_id, values) => {
  return await axios.put(`${process.env.REACT_APP_API_URL_COFFEE}/api/auth/update/companyDetails/${_id}`, values);
};

export const getDetail = async (_id) => {
  return await axios.get(`${process.env.REACT_APP_API_URL_COFFEE}/api/auth/get/companyDetails/${_id}`);
};