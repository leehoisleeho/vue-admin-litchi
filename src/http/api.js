import axiosInstance from "./axios.config.js";

// 登录
export const login = async (data) => {
  return axiosInstance.post("/login", data);
};

// 获取全部目录信息
export const getDirectoryList = async () => {
  return axiosInstance.get("/directory/all");
};

// 创建目录
export const createDirectory = async (data) => {
  return axiosInstance.post("/directory/create", data);
};

// 创建菜单
export const createMenu = async (data) => {
  return axiosInstance.post("/menu", data);
};
