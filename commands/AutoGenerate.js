import axios from "axios";
import fs from "fs";
import FormData from "form-data";
import { getSession } from "../utils/sessionManager.js";

const baseURL = process.env.API_BASE_URL;

export async function autoGenerate({ type, dataFile, encoding }) {
  const url = `${baseURL}/ConMasAPI/Rests/APIExecute.aspx`;
  const form = new FormData();

  form.append("command", "AutoGenerate");
  form.append("type", type);
  form.append("dataFile", fs.createReadStream(dataFile));
  form.append("encoding", encoding);

  const sessionCookie = await getSession(); // セッションを取得

  const headers = {
    ...form.getHeaders(),
    Cookie: sessionCookie,
  };

  try {
    const response = await axios.post(url, form, { headers });
    console.log(response.data);
  } catch (error) {
    console.error("Error:", error);
  }
}

// `action`としてエクスポート
export const action = autoGenerate;

// `default`エクスポートとしてCLIコマンドを定義
export default function (program) {
  program
    .command("AutoGenerate <type> <dataFile>")
    .description("Upload a file to generate report data")
    .option("--encoding <encoding>", "Specify encoding", "65001")
    .action((type, dataFile, options) => {
      autoGenerate({ type, dataFile, encoding: options.encoding });
    });
}
