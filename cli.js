import { Command } from "commander";
import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";

const program = new Command();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

program
  .name("irepo-cli")
  .description("CLI tool for interacting with reports")
  .version("1.0.0");

// コマンドの読み込みと実行を非同期で行う関数
async function loadCommands() {
  const commandsDir = path.join(__dirname, "commands");
  const files = fs.readdirSync(commandsDir);

  // すべてのコマンドファイルを非同期で読み込む
  const commandPromises = files
    .filter((file) => file.endsWith(".js"))
    .map(async (file) => {
      try {
        const { default: command } = await import(path.join(commandsDir, file));
        if (typeof command === "function") {
          command(program);
        } else {
          console.error(`ファイル ${file} は関数をエクスポートしていません。`);
        }
      } catch (error) {
        console.error(
          `コマンド ${file} の読み込み中にエラーが発生しました:`,
          error
        );
      }
    });

  // すべてのコマンドが読み込まれるのを待つ
  await Promise.all(commandPromises);

  program.parse(process.argv);
}

// プログラムを実行
loadCommands().catch((error) => {
  console.error("CLIの初期化中にエラーが発生しました:", error);
  process.exit(1);
});
