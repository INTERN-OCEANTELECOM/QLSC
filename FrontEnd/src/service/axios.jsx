import axios from "axios";

const instance = axios.create({
  // baseURL: "http://192.168.1.63:8080",
    baseURL: "http://localhost:8080",
});

instance.interceptors.response.use(
  function (response) {
    return response.data ? response.data : { statusCode: response.data };
  },
  function (error) {
    let res = {};
    if (error.response) {
      res.data = error.response.data;
      res.status = error.response.status;
      res.headers = error.response.headers;
      // The request was made and the server responded with a status code
      // that falls out of the range of 2xx
    } else if (error.request) {
      // The request was made but no response was received
      // `error.request` is an instance of XMLHttpRequest in the browser
      // and an instance of http.ClientRequest in node.js
      console.log(error.request);
    } else {
      // Something happened in setting up the request that triggered an Error
      console.log("Error", error.message);
    }
    // Any status codes that falls outside the range of 2xx cause this function to trigger
    // Do something with response error
    return res;
    // return Promise.reject(error);
  }
);

export default instance;
