import axios from "axios";
import { notification } from "ant-design-vue";

// 创建 Axios 实例
const axiosInstance = axios.create({
  baseURL: "http://127.0.0.1:8090", // 替换为你的后端 URL
  timeout: 5000,
});

// 请求拦截器
axiosInstance.interceptors.request.use(
  (config) => {
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// 响应拦截器
axiosInstance.interceptors.response.use(
  (response) => {
    // 对响应数据做点什么
    return response.data;
  },
  (error) => {
    // 对响应错误做点什么
    notification.open({
      type: "error",
      message: "请求错误",
      description: error.response.data.message,
    });
    return Promise.reject(error);
  }
);

export default axiosInstance;
