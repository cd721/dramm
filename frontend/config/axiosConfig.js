import axios from "axios";

const axiosInstance = axios.create({
    timeout: 180000, // 3 minutes
});

export default axiosInstance;