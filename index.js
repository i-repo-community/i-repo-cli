import { openai } from "./utils/openai.js";
import { toolsConfig } from "./utils/toolsConfig.js";

async function interpretAndExecute(inputText) {
  const response = await openai.chat.completions.create({
    model: "gpt-4-turbo",
    messages: [{ role: "user", content: inputText }],
    tools: toolsConfig,
    tool_choice: "auto",
  });

  const message = response.choices[0].message;

  if (message.tool_calls && message.tool_calls.length > 0) {
    const toolCall = message.tool_calls[0];
    const toolName = toolCall.function.name;
    const toolArgs = JSON.parse(toolCall.function.arguments);

    try {
      // 動的にインポートするパスを出力して確認
      const importPath = `./commands/${
        toolName.charAt(0).toUpperCase() + toolName.slice(1)
      }.js`;
      // console.log(`インポートパス: ${importPath}`);

      // 動的に対応するコマンドファイルを読み込み、action関数を実行
      const { action } = await import(importPath);
      await action(toolArgs);
    } catch (error) {
      console.error(
        `ツール "${toolName}" に対応するファイルが見つかりません。エラー:`,
        error
      );
    }
  } else {
    console.log(`アシスタントの応答: ${message.content || "応答がありません"}`);
  }
}

// コマンドライン引数を受け取り、関数に渡す
const userInput = process.argv.slice(2).join(" ");
interpretAndExecute(userInput);
