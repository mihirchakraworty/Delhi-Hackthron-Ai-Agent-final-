import axios from "axios";

export const getPlace = async (place) => {
  const res = await axios.get(
    `http://localhost:5000/api/place/${place}`
  );

  return res.data.place;
};