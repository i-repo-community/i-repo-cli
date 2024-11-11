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

async function downloadCsv({
  reportId,
  withImage = true,
  withPDF = true,
  withPDFLayer = true,
  encoding = "932",
}) {
  try {
    const sessionCookie = await getSession(); // セッションを取得
    const response = await apiClient.post(
      "",
      new URLSearchParams({
        command: "DownloadCsv",
        report: reportId,
        withImage: withImage.toString(),
        withPDF: withPDF.toString(),
        withPDFLayer: withPDFLayer.toString(),
        encoding,
      }).toString(),
      {
        headers: {
          Cookie: sessionCookie,
        },
      }
    );

    // バイナリデータを直接ファイルに保存
    fs.writeFileSync("report.zip", response.data);
    console.log("ファイルが正常に保存されました: report.zip");
  } catch (error) {
    console.error("CSVダウンロード失敗:", error);
    throw error;
  }
}

// `action`としてエクスポート
export const action = downloadCsv;

// `default`エクスポートとしてCLIコマンドを定義
export default function (program) {
  program
    .command("DownloadCsv <reportId>")
    .description("Download CSV report by its ID")
    .option("--no-image", "Exclude images")
    .option("--no-pdf", "Exclude PDF")
    .option("--no-pdf-layer", "Exclude PDF layers")
    .option("--encoding <encoding>", "Specify encoding", "932")
    .action((reportId, options) => {
      const { image, pdf, pdfLayer, encoding } = options;
      downloadCsv({
        reportId,
        withImage: image,
        withPDF: pdf,
        withPDFLayer: pdfLayer,
        encoding,
      });
    });
}
