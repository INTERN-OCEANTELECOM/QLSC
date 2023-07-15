import {
  FETCH_USER_LOGIN,
  FETCH_USER_ERROR,
  FETCH_USER_SUCCESS,
  USER_LOGOUT,
  USER_REFRESH,
  FETCH_USER_SUCCESS_USER,
  FETCH_USER_SUCCESS_ADMIN,
  FETCH_USER_ERROR_MESSAGE,
  FETCH_USER_ERROR_LOCK,
} from "../actions/userAction";

const INITIAL_STATE = {
  account: {
    email: "",
    auth: null,
    status: null,
  },
  isError: false,
};

const userReducer = (state = INITIAL_STATE, action) => {
  switch (action.type) {
    case FETCH_USER_LOGIN:
      return {
        ...state,
        isError: false,
      };

    case FETCH_USER_ERROR:
      return {
        ...state,
        account: {
          auth: false,
        },
        isError: false,
      };

    case FETCH_USER_ERROR_MESSAGE:
      return {
        ...state,
        account: {
          email: action.data.email,
          auth: true,
          status: 3,
        },
        isError: false,
      };

    case FETCH_USER_ERROR_LOCK:
      return {
        ...state,
        account: {
          email: action.data.email,
          auth: true,
          status: 4,
        },
        isError: false,
      };

    case FETCH_USER_SUCCESS:
      return {
        ...state,
        account: {
          email: "",
          auth: false,
          status: 0,
        },
        isError: false,
      };

    case FETCH_USER_SUCCESS_ADMIN:
      return {
        ...state,
        account: {
          email: action.data.email,
          auth: true,
          status: 1,
        },
        isError: false,
      };

    case FETCH_USER_SUCCESS_USER:
      return {
        ...state,
        account: {
          email: action.data.email,
          auth: true,
          status: 2,
        },
        isError: false,
      };

    case USER_LOGOUT:
      localStorage.removeItem("email");
      localStorage.removeItem("role");
      localStorage.removeItem("timelock");
      localStorage.removeItem("po");
      localStorage.removeItem("dataList");
      return {
        ...state,
        account: {
          email: "",
          auth: false,
          status: null,
        },
      };

    case USER_REFRESH:
      return {
        ...state,
        account: {
          email: localStorage.getItem("email"),
          auth: true,
        },
      };

    default:
      return state;
  }
};

export default userReducer;
