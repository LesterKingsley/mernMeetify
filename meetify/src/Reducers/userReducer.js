const {
  FETCH_USER_LOADING,
  FETCH_USER_DATA,
  FETCH_USER_ERROR,
} = require("./type");

const initialValue = {
  loading: false,
  data: {},
  error: null,
};

const userReducer = (state = initialValue, { type, payload }) => {
  switch (type) {
    case FETCH_USER_LOADING:
      return { ...state, loading: true };
    case FETCH_USER_DATA:
      return { ...state, loading: false, data: payload };
    case FETCH_USER_ERROR:
      return { ...state, loading: false, error: payload };
    default:
      return state;
  }
};
export default userReducer;
