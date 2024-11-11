import axios from "axios";
import fs from "fs";
import { getSession } from "../utils/sessionManager.js";
import dotenv from "dotenv";

dotenv.config();

const apiClient = axios.create({
  baseURL: process.env.API_BASE_URL,
  headers: {
    "Content-Type": "application/x-www-form-urlencoded",
  },
  responseType: "arraybuffer", // バイナリデータを受け取る設定
});

async function getReportFile({
  fileType,
  report,
  systemKey1,
  systemKey2,
  systemKey3,
  systemKey4,
  systemKey5,
  fileName,
  pageNo,
  isInitValueChageDisplay,
}) {
  try {
    const sessionCookie = await getSession();

    const params = new URLSearchParams({
      command: "GetReportFile",
      fileType,
    });

    if (report) {
      params.append("report", report);
    } else if (
      systemKey1 &&
      systemKey2 &&
      systemKey3 &&
      systemKey4 &&
      systemKey5
    ) {
      params.append("systemKey1", systemKey1);
      params.append("systemKey2", systemKey2);
      params.append("systemKey3", systemKey3);
      params.append("systemKey4", systemKey4);
      params.append("systemKey5", systemKey5);
    } else {
      throw new Error("`report` または `systemKey1~5` が必要です。");
    }

    if (fileName) {
      params.append("fileName", fileName);
    }

    if (pageNo && (fileType === "pdf" || fileType === "pdfLayer")) {
      params.append("pageNo", pageNo);
    }

    if (isInitValueChageDisplay !== undefined && fileType === "pdf") {
      params.append("isInitValueChageDisplay", isInitValueChageDisplay);
    }

    const response = await apiClient.post("", params.toString(), {
      headers: {
        Cookie: sessionCookie,
      },
    });

    // ファイル名を設定。fileNameが未指定の場合はレスポンスヘッダから取得
    let outputFileName = fileName;

    if (!fileName && response.headers["content-disposition"]) {
      const match =
        response.headers["content-disposition"].match(/filename="(.+)"/);
      outputFileName = match ? match[1] : `report.${fileType}`; // ファイル名が見つからない場合はデフォルト名
    } else if (!fileName) {
      outputFileName = `report.${fileType}`;
    }

    fs.writeFileSync(outputFileName, response.data);
    console.log(`ファイルが正常に保存されました: ${outputFileName}`);
  } catch (error) {
    console.error("帳票ファイル取得失敗:", error);
    throw error;
  }
}

export const action = getReportFile;

export default function (program) {
  program
    .command("GetReportFile <fileType>")
    .description("Get report file (PDF or Excel)")
    .requiredOption("-r, --report <reportId>", "Report ID")
    .option("-s1, --systemKey1 <systemKey1>", "System Key 1")
    .option("-s2, --systemKey2 <systemKey2>", "System Key 2")
    .option("-s3, --systemKey3 <systemKey3>", "System Key 3")
    .option("-s4, --systemKey4 <systemKey4>", "System Key 4")
    .option("-s5, --systemKey5 <systemKey5>", "System Key 5")
    .option(
      "-f, --file-name <fileName>",
      "Output file name (without extension)"
    )
    .option(
      "-p, --page-no <pageNo>",
      "Page number (comma-separated for multiple pages, hyphen for range)"
    )
    .option(
      "-i, --init-value-change-display <isInitValueChageDisplay>",
      "Show initial value changes (0 or 1)",
      "0"
    ) // デフォルト値を0に設定
    .action(async (fileType, options) => {
      // console.log(options); // デバッグ用
      await getReportFile({ fileType, ...options });
    });
}
