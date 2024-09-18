import axios from "axios";

export const createArtPiece = async (values) => {
  return await axios.post(
    `${process.env.REACT_APP_API_URL}/api/auth/create/ArtPiece`,
    values
  );
};

export const removeArtPiece = async (_id) => {
  return await axios.delete(
    `${process.env.REACT_APP_API_URL}/api/auth/remove/ArtPiece/${_id}`
  );
};

export const listArtPiece = async () => {
  return await axios.get(
    `${process.env.REACT_APP_API_URL}/api/auth/list/ArtPiece`
  );
};

export const updateArtPiece = async (_id, values) => {
  return await axios.put(
    `${process.env.REACT_APP_API_URL}/api/auth/update/ArtPiece/${_id}`,
    values
  );
};

export const getArtPiece = async (_id) => {
  return await axios.get(
    `${process.env.REACT_APP_API_URL}/api/auth/get/ArtPiece/${_id}`
  );
};
