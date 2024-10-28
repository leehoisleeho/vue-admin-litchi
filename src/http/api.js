import axiosInstance from "./axios.config.js";

// 登录
export const login = async (data) => {
  return axiosInstance.post("/login", data);
};
