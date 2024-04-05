// import { baseUrl } from "@/Utils/PortDetails";
// import axios from "axios";
// import Cookies from "js-cookie";

// const token = Cookies.get("jwttoken");
// console.log(token);
// const axiosInstance = axios.create({
//   baseURL: baseUrl,
//   headers: {
//     authorization: `Bearer ${token}`,
//   },
// });

// export default axiosInstance;

import { baseUrl } from "@/Utils/PortDetails";
import { HttpStatusCode } from "@/types/HttpStatusCode";
import axios from "axios";
import Cookies from "js-cookie";
import swal from "sweetalert";

const token = Cookies.get("jwttoken");
// console.log(token);

const axiosInstance = axios.create({
  baseURL: baseUrl,
  withCredentials: true
});

// Add a request interceptor
axiosInstance.interceptors.request.use(
  (config) => {
    config.headers.Authorization = `Bearer ${token}`;
    return config;
  },
  (error) => {
    // Do something with request error
    console.log("axios interceptor error");
    return Promise.reject(error);
  }
);
axiosInstance.interceptors.response.use(
  (response) => {
    console.log('all response data form the response inteceptor: ' ,response )

    return response;
  },
  (error) => {
    // Do something with response error
    // For example, check if the status code is 403 (Forbidden)
    if (error.response.status === 403) {
      Cookies.remove("jwttoken");
      window.location.href = "/sign-in";
    }
    return Promise.reject(error);
  }
);

export default axiosInstance;
