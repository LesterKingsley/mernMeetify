import Axios from "axios";
const {
  FETCH_USER_LOADING,
  FETCH_USER_ERROR,
  FETCH_USER_DATA,
} = require("./type");

const fetchUserLoading = () => {
  return {
    type: FETCH_USER_LOADING,
  };
};
const fetchUserData = (payload) => {
  return {
    type: FETCH_USER_DATA,
    payload: payload,
  };
};
const fetchUserError = (payload) => {
  return {
    type: FETCH_USER_ERROR,
    payload: payload,
  };
};

const fetchUser = () => {
  return async (dispatch) => {
    try {
      dispatch(fetchUserLoading());
      //check token
      const token = localStorage.getItem("auth-token");
      const checkToken = await Axios.post(
        "http://localhost:7000/meetify/tokenVerify",
        {},
        { headers: { "x-auth-token": token } }
      );
      const userFetch = await Axios.get(
        "http://localhost:7000/meetify/user/fetchUser",

        { headers: { "x-auth-token": token } }
      );
      dispatch(fetchUserData(userFetch.data));
      console.log(userFetch.data);
    } catch (err) {
      dispatch(fetchUserError(err.response.data.msg));
      console.error(err.response.data.msg);
    }
  };
};
export default fetchUser;
