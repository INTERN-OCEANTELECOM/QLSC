import { loginAdmin } from "../../service/service";

export const USER_LOGIN = 'USER_LOGIN';
export const FETCH_USER_LOGIN = "FETCH_USER_LOGIN";
export const FETCH_USER_ERROR = "FETCH_USER_ERROR";
export const FETCH_USER_ERROR_MESSAGE = "FETCH_USER_ERROR_MESSAGE";
export const FETCH_USER_ERROR_LOCK = "FETCH_USER_ERROR_LOCK";
export const FETCH_USER_SUCCESS = "FETCH_USER_SUCCESS";
export const FETCH_USER_SUCCESS_ADMIN = "FETCH_USER_SUCCESS_ADMIN";
export const FETCH_USER_SUCCESS_USER = "FETCH_USER_SUCCESS_USER";
export const USER_LOGOUT = 'USER_LOGOUT'
export const USER_REFRESH = "USER_REFRESH";

// handle login redux
export const handleLoginRedux = (email, password) => {
    return  async(dispatch, getState) => {
        dispatch({type: FETCH_USER_LOGIN})

        let res = await loginAdmin(email, password);
        if (res && res.statusCode === 200 && res.data.status === 0) {
            localStorage.setItem("email", email)
            dispatch({
                type: FETCH_USER_SUCCESS,
                data: {email}
            })
            localStorage.setItem("role", res.data.roles[0].roleName);
        } else if (res && res.statusCode === 200 && res.data.status === 2) {
            dispatch({
              type: FETCH_USER_ERROR_MESSAGE,
              data: { email },
            });
        } else if (res && res.statusCode === 200) {
          if (res.data.roles[0].roleName === "ROLE_ADMIN") {
            localStorage.setItem("email", email);
            dispatch({
              type: FETCH_USER_SUCCESS_ADMIN,
              data: { email },
            });
            localStorage.setItem("role", res.data.roles[0].roleName);
          } else if (res.data.roles[0].roleName === "ROLE_MANAGER") {
            localStorage.setItem("email", email);
            dispatch({
              type: FETCH_USER_SUCCESS_USER,
              data: { email },
            });
            localStorage.setItem("role", res.data.roles[0].roleName);
          } else if (res.data.roles[0].roleName === "ROLE_USER") {
            localStorage.setItem("email", email);
            dispatch({
              type: FETCH_USER_SUCCESS_USER,
              data: { email },
            });
            localStorage.setItem("role", res.data.roles[0].roleName);
          } else if (res.data.roles[0].roleName === "ROLE_REPAIRMAN") {
            localStorage.setItem("email", email);
            dispatch({
              type: FETCH_USER_SUCCESS_USER,
              data: { email },
            });
            localStorage.setItem("role", res.data.roles[0].roleName);
          } else if (res.data.roles[0].roleName === "ROLE_KCSANALYST") {
            localStorage.setItem("email", email);
            dispatch({
              type: FETCH_USER_SUCCESS_USER,
              data: { email },
            });
            localStorage.setItem("role", res.data.roles[0].roleName);
          } 
          } else {
            if (res && res.statusCode === 204) {
              dispatch({
                type: FETCH_USER_ERROR_MESSAGE,
                data: { email },
              });
            }
          if (
            res &&
            res.statusCode === 204 &&
            res.statusMessage === "YOUR ACCOUNT IS TEMPORARILY LOCKED"
          ) {
            localStorage.setItem("timelock", res.data);
            dispatch({
              type: FETCH_USER_ERROR_LOCK,
              data: { email },
            });
          }
        }

    }
}

//handle logout
export const handleLogoutRedux = () => {
    return (dispatch, getState) => {
        dispatch({
           type: USER_LOGOUT, 
        })
    }
}


// handle refresh web
export const handleRefresh = () => {
    return (dispatch, getState) => {
      dispatch({
        type: USER_REFRESH,
      });
    };
}