import axios from "axios";
import { getSession } from "../utils/sessionManager.js";
import dotenv from "dotenv";

dotenv.config();

const apiClient = axios.create({
  baseURL: process.env.API_BASE_URL,
  headers: {
    "Content-Type": "application/x-www-form-urlencoded",
    Accept: "application/xml",
  },
});

async function getReportDetail(topId) {
  try {
    const sessionCookie = await getSession(); // セッションを取得
    const response = await apiClient.post(
      "",
      new URLSearchParams({
        command: "GetReportDetail",
        topId: topId,
      }).toString(),
      {
        headers: {
          Cookie: sessionCookie,
        },
      }
    );

    console.log(response.data);

    return response.data;
  } catch (error) {
    console.error("レポート取得失敗:", error);
    throw error;
  }
}

// `action`としてエクスポート
export const action = getReportDetail;

export default function (program) {
  program
    .command("GetReportDetail")
    .description("Get details of a report by its ID")
    .requiredOption("-t, --topId <topId>", "トップIDを指定")
    .action(async (options) => {
      const { topId } = options;
      if (!topId) {
        console.error("トップIDを指定してください。");
        process.exit(1);
      }

      try {
        const result = await action({ topId });
        console.log(JSON.stringify(result, null, 2));
      } catch (error) {
        console.error("エラーが発生しました:", error);
      }
    });
}
