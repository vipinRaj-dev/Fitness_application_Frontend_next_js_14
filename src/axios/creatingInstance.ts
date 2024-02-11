import { baseUrl } from "@/Utils/PortDetails";
import axios from "axios";
import Cookies from "js-cookie";


let token = Cookies.get("jwttoken");
console.log(token);
const axiosInstance = axios.create({
  baseURL: baseUrl,
  headers: {
    authorization: `Bearer ${token}`,
  },
});


export default axiosInstance;