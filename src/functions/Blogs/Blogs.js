import axios from "axios";

export const createBlogs = async (values) => {
  return await axios.post(
    `${process.env.REACT_APP_API_URL}/api/auth/create/blogs`,
    values
  );
};

export const removeBlogs = async (_id) => {
  return await axios.delete(
    `${process.env.REACT_APP_API_URL}/api/auth/remove/blogs/${_id}`
  );
};

export const listBlogs = async () => {
  return await axios.get(
    `${process.env.REACT_APP_API_URL}/api/auth/list/blogs`
  );
};

export const updateBlogs = async (_id, values) => {
  return await axios.put(
    `${process.env.REACT_APP_API_URL}/api/auth/update/blogs/${_id}`,
    values
  );
};

export const getBlogs = async (_id) => {
  return await axios.get(
    `${process.env.REACT_APP_API_URL}/api/auth/get/blogs/${_id}`
  );
};

export const uploadImage = async (body) => {
  return await axios.post(
    `${process.env.REACT_APP_API_URL}/api/auth/cms-blog/image-upload`,
    body
  );
};
