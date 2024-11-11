import axios from "axios";
import dotenv from "dotenv";

dotenv.config();

const apiClient = axios.create({
  baseURL: process.env.API_BASE_URL,
  headers: {
    "Content-Type": "application/x-www-form-urlencoded",
  },
});

let sessionCookie = "";

async function getSession() {
  if (sessionCookie) {
    return sessionCookie;
  }

  try {
    const response = await apiClient.post(
      "",
      new URLSearchParams({
        command: "Login",
        user: process.env.API_USER,
        password: process.env.API_PASSWORD,
      }).toString()
    );

    const cookies = response.headers["set-cookie"];
    if (cookies) {
      sessionCookie = cookies.map((cookie) => cookie.split(";")[0]).join("; ");
    }
    // console.log("ログイン成功:", sessionCookie);
    return sessionCookie;
  } catch (error) {
    console.error("ログイン失敗:", error);
    throw new Error("ログインエラー");
  }
}

export { getSession };
