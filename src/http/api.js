import axiosInstance from "./axios.config.js";

// 初始化系统
export const initSystem = async () => {
  return axiosInstance.post("/init");
};

// 登录
export const login = async (data) => {
  return axiosInstance.post("/login", data);
};

// 创建账号
export const createAccount = async (data) => {
  return axiosInstance.post("/account/create", data);
};

// 获取全部目录信息
export const getDirectoryList = async () => {
  return axiosInstance.get("/directory/all");
};
// 删除目录
export const deleteDirectory = async (id) => {
  return axiosInstance.delete(`/directory/${id}`);
};

// 创建目录
export const createDirectory = async (data) => {
  return axiosInstance.post("/directory/create", data);
};

// 获取目录详情
export const getDirectoryDetail = async (id) => {
  return axiosInstance.get(`/directory/${id}`);
};
// 更新目录
export const updateDirectory = async (id, data) => {
  return axiosInstance.put(`/directory/${id}`, data);
};

// 创建菜单
export const createMenu = async (data) => {
  return axiosInstance.post("/menu", data);
};
// 获取菜单详情
export const getMenuDetail = async (id) => {
  return axiosInstance.get(`/menu/${id}`);
};

// 更新菜单
export const updateMenu = async (id, data) => {
  return axiosInstance.put(`/menu/${id}`, data);
};

// 删除菜单
export const deleteMenuOne = async (id) => {
  return axiosInstance.delete(`/menu/${id}`);
};
