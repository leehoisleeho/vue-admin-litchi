import { initSystem } from "@api";
import router from "../router/index";
export const init = async () => {
  try {
    await initSystem();
    const token = localStorage.getItem("token");
    if (!token) {
      router.push("/login");
    }
  } catch (e) {
    console.log(e);
  }
};
