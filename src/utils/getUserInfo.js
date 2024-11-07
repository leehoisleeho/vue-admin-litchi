import { getAccountDetail } from "@api";
export const getUserInfo = async (token) => {
  const parts = token.split(".");
  const encodedPayload = parts[1]; // 载荷部分
  // JWT的载荷部分是base64编码的，需要解码
  const decodedPayload = atob(encodedPayload);
  // 将解码后的字符串转换为JSON对象
  const payload = JSON.parse(decodedPayload);
  // 现在，payload对象包含了JWT中的用户信息
  const res = await getAccountDetail(payload.id);
  return res.data;
};
