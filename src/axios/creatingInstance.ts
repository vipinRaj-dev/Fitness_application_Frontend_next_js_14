import { baseUrl } from "@/Utils/PortDetails";
import axios from "axios";
import Cookies from "js-cookie";


const token = Cookies.get("jwttoken");
console.log(token);
const axiosInstance = axios.create({
  baseURL: baseUrl,
  headers: {
    authorization: `Bearer ${token}`,
  },
});


export default axiosInstance;