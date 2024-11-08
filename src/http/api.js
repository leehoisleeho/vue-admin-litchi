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
// 获取全部账号信息
export const getAccountList = async () => {
  return axiosInstance.get("/account/findAll");
};
// 删除账号
export const deleteAccount = async (id) => {
  return axiosInstance.delete(`/account/${id}`);
};
// 获取账号详情
export const getAccountDetail = async (id) => {
  return axiosInstance.get(`/account/find/${id}`);
};
// 更新账号
export const updateAccount = async (id, data) => {
  return axiosInstance.put(`/account/${id}`, data);
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

// 创建权限
export const createPermission = async (data) => {
  return axiosInstance.post("/permissions", data);
};

// 获取权限列表
export const getPermissions = async () => {
  return axiosInstance.get("/permissions/findAll");
};

// 删除权限
export const deletePermissionOne = async (id) => {
  return axiosInstance.delete(`/permissions/${id}`);
};
// 获取权限详情
export const getPermissionOne = async (id) => {
  return axiosInstance.get(`/permissions/findOne/${id}`);
};
// 修改权限
export const updatePermission = async (id, data) => {
  return axiosInstance.put(`/permissions/${id}`, data);
};

// 获取系统配置信息
export const getSystemConfig = async () => {
  return axiosInstance.get("/system");
};

// 编辑
export const updateSystemConfig = async (data) => {
  return axiosInstance.put("/system", data);
};

// 图片上传
export const uploadImage = async (data) => {
  return axiosInstance.post("/upload/img", data);
};
