import axios from "axios";

export const createBlogsComment = async (values) => {
    return await axios.post(
      `${process.env.REACT_APP_API_URL}/api/auth/create/blogsComment`,
      values
    );
  };
  
  export const removeBlogsComment = async (_id) => {
    return await axios.delete(
      `${process.env.REACT_APP_API_URL}/api/auth/remove/blogsComment/${_id}`
    );
  };
  
  export const listBlogsComment= async () => {
    return await axios.get(
      `${process.env.REACT_APP_API_URL}/api/auth/list/blogsComment`
    );
  };
  
  
  export const updateBlogsComment= async (_id, values) => {
    return await axios.put(
      `${process.env.REACT_APP_API_URL}/api/auth/update/blogsComment/${_id}`,
      values
    );
  };
  
  export const getBlogsComment= async (_id) => {
    return await axios.get(
      `${process.env.REACT_APP_API_URL}/api/auth/get/blogsComment/${_id}`
    );
  };
  