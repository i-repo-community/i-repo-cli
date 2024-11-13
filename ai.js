import inquirer from "inquirer";
import { openai } from "./utils/openai.js";
import { toolsConfig } from "./utils/toolsConfig.js";

// グローバル状態
let memory = [];
let currentTool = null;
let collectedParams = {};
let isConversationMode = false; // 会話モードのフラグ

// メインメニューの生成
async function showMainMenu() {
  // 最初のモード選択
  const { mode } = await inquirer.prompt([
    {
      type: "list",
      name: "mode",
      message: "利用モードを選択してください",
      choices: [
        { name: "🤖 AI会話モード - 自然な日本語で操作", value: "conversation" },
        { name: "📋 選択会話モード - メニューから選択", value: "selection" },
        new inquirer.Separator(),
        { name: "❓ ヘルプを表示", value: "help" },
        { name: "⚡ 終了", value: "exit" },
      ],
    },
  ]);

  switch (mode) {
    case "conversation":
      await startConversationMode();
      break;
    case "selection":
      await showFunctionMenu();
      break;
    case "help":
      displayHelp();
      await showMainMenu();
      break;
    case "exit":
      console.log("\nご利用ありがとうございました。");
      process.exit(0);
  }
}

// 機能選択メニュー
async function showFunctionMenu() {
  const separator1 = new inquirer.Separator("=== 利用可能な機能 ===");
  const separator2 = new inquirer.Separator("=== システムコマンド ===");

  const toolChoices = toolsConfig.map((tool) => ({
    name: `${tool.function.name.padEnd(15)} - ${tool.function.description}`,
    value: tool.function.name,
    short: tool.function.name,
  }));

  const systemCommands = [
    { name: "🔙 モード選択に戻る", value: "back" },
    { name: "📊 状態を表示", value: "state" },
    { name: "🔄 セッションをクリア", value: "clear" },
    { name: "❌ プログラムを終了", value: "exit" },
  ];

  const { action } = await inquirer.prompt([
    {
      type: "list",
      name: "action",
      message: "実行したい操作を選択してください",
      choices: [separator1, ...toolChoices, separator2, ...systemCommands],
      pageSize: 15,
    },
  ]);

  if (action === "back") {
    await showMainMenu();
  } else {
    await handleAction(action);
    if (action !== "exit") {
      await showFunctionMenu();
    }
  }
}

// 会話モードの実装
async function startConversationMode() {
  isConversationMode = true;
  console.log("\n=== AI会話モードを開始します ===");
  console.log("自然な日本語で操作を指示してください");
  console.log('例: "帳票を作成して" "天気を教えて" など');
  console.log("\n=== システムコマンド ===");
  console.log("・戻る    : モード選択に戻ります");
  console.log("・clear   : 会話をクリアします");
  console.log("・help    : ヘルプを表示します");
  console.log("・state   : 現在の状態を表示します");
  console.log("===============================\n");

  while (isConversationMode) {
    const { input } = await inquirer.prompt([
      {
        type: "input",
        name: "input",
        message: "アイレポちゃん>",
        prefix: "💬",
      },
    ]);

    // システムコマンドの処理
    const command = input.trim().toLowerCase();
    switch (command) {
      case "戻る":
        console.log("\n💬 アイレポちゃん> モード選択に戻ります。");
        isConversationMode = false;
        return showMainMenu();
      case "clear":
        clearSession();
        console.log("\n💬 アイレポちゃん> 新しい会話を開始します。");
        continue;
      case "help":
        displayConversationHelp();
        continue;
      case "state":
        await displayCurrentState();
        continue;
      default:
        await handleConversation(input);
    }
  }
}
// 状態表示
async function displayCurrentState() {
  console.log("\n=== 現在の状態 ===");
  console.log("モード: AI会話モード");
  if (currentTool) {
    console.log("現在のツール:", currentTool.name);
    console.log(
      "収集済みパラメータ:",
      JSON.stringify(collectedParams, null, 2)
    );
  } else {
    console.log("ツール: 未選択");
  }
  console.log("会話履歴数:", memory.length, "件");

  const { showDetails } = await inquirer.prompt([
    {
      type: "confirm",
      name: "showDetails",
      message: "会話履歴を表示しますか？",
      prefix: "💬",
      default: false,
    },
  ]);

  if (showDetails) {
    console.log("\n=== 会話履歴 ===");
    memory.forEach((entry, index) => {
      console.log(`${index + 1}. ${entry.role}: ${entry.content}`);
    });
  }
  console.log("===============\n");
}

// 会話モード用のヘルプ表示
function displayConversationHelp() {
  console.log("\n=== AI会話モード ヘルプ ===");
  console.log("利用可能な機能:");
  toolsConfig.forEach((tool) => {
    console.log(`・${tool.function.name}: ${tool.function.description}`);
  });

  console.log("\nシステムコマンド:");
  console.log("・戻る    : モード選択に戻ります");
  console.log("・clear   : 会話をクリアします");
  console.log("・help    : このヘルプを表示します");
  console.log("・state   : 現在の状態を表示します");

  console.log("\n使用例:");
  console.log('・"帳票を作成して"');
  console.log('・"xmlファイルでutf-8エンコードの帳票を作成"');
  console.log('・"天気を確認したい"');
  console.log("===========================\n");
}

// 会話の処理
async function handleConversation(input) {
  memory.push({ role: "user", content: input });

  try {
    const response = await openai.chat.completions.create({
      messages: memory,
      tools: toolsConfig,
      tool_choice: "auto",
    });

    const message = response.choices[0].message;
    const assistantContent = message.content || "判断中..."; // デフォルトメッセージを変更
    memory.push({ role: "assistant", content: assistantContent });

    if (message.tool_calls && message.tool_calls.length > 0) {
      const toolCall = message.tool_calls[0];
      const selectedTool = toolsConfig.find(
        (t) => t.function.name === toolCall.function.name
      );

      if (!selectedTool) {
        console.log(
          "\n💬 アイレポちゃん> 申し訳ありません。対応する機能が見つかりませんでした。"
        );
        return;
      }

      currentTool = selectedTool.function;
      try {
        collectedParams = JSON.parse(toolCall.function.arguments);

        // ツールが選択された時の応答を改善
        console.log(
          `\n💬 アイレポちゃん> ${selectedTool.function.name}を実行します。`
        );
        if (assistantContent !== "判断中...") {
          console.log(`${assistantContent}`);
        }
      } catch (e) {
        console.log(
          "\n💬 アイレポちゃん> パラメータの解析に失敗しました。もう一度お試しください。"
        );
        return;
      }

      // パラメータの確認と補完
      await confirmAndCompleteParameters(selectedTool);
    } else {
      console.log(`\n💬 アイレポちゃん> ${assistantContent}`);
    }
  } catch (error) {
    console.log(
      "\n💬 アイレポちゃん> 申し訳ありません。エラーが発生しました。"
    );
    console.error(error);
  }
}

// パラメータの確認と補完
async function confirmAndCompleteParameters(toolConfig) {
  const required = toolConfig.function.parameters.required || [];
  const properties = toolConfig.function.parameters.properties;
  const missingParams = [];

  // 必要なパラメータをチェック
  for (const key of required) {
    if (!collectedParams[key]) {
      missingParams.push({
        key,
        description: properties[key].description,
      });
    }
  }

  // 不足しているパラメータがあれば入力を求める
  if (missingParams.length > 0) {
    console.log("\n💬 アイレポちゃん> 追加の情報が必要です:");
    for (const param of missingParams) {
      const { value } = await inquirer.prompt([
        {
          type: getInputType(param.key, properties[param.key]),
          name: "value",
          message: param.description,
          choices: getChoices(param.key, properties[param.key]),
        },
      ]);
      collectedParams[param.key] = value;
    }
  }

  // パラメータの確認
  console.log("\n=== 実行パラメータ ===");
  Object.entries(collectedParams).forEach(([key, value]) => {
    console.log(`${key}: ${value}`);
  });

  const { confirmed } = await inquirer.prompt([
    {
      type: "confirm",
      name: "confirmed",
      message: "これらのパラメータで実行してよろしいですか？",
      default: true,
      prefix: "💬",
    },
  ]);

  if (confirmed) {
    console.log("\n💬 アイレポちゃん> 承知しました。実行を開始します...");
    const result = await executeCommand(currentTool.name, collectedParams);
    displayResult(result);
  } else {
    console.log("\n💬 アイレポちゃん> 実行をキャンセルしました。");
    console.log("パラメータを変更する場合は、もう一度最初からお試しください。");
    console.log("他の操作を行う場合は、そのまま指示してください。");
  }
}

// 選択肢の生成
function getChoices(key, param) {
  if (key === "type") {
    return ["xml", "csv", "xmlZip", "csvZip"];
  }
  if (key === "encoding") {
    return [
      { name: "UTF-8 (65001)", value: "65001" },
      { name: "Shift-JIS (932)", value: "932" },
    ];
  }
  if (
    key.toLowerCase().includes("mode") ||
    [
      "thumbnailUpdate",
      "calculateEnable",
      "customMasterLinkage",
      "clusterThreshold",
    ].includes(key)
  ) {
    return [
      { name: "有効にする", value: "1" },
      { name: "無効にする", value: "0" },
    ];
  }
  return null;
}

// パラメータ入力の処理
async function promptForParameters(toolConfig) {
  const parameters = toolConfig.function.parameters.properties;
  const requiredParams = toolConfig.function.parameters.required || [];
  const questions = [];

  for (const [key, param] of Object.entries(parameters)) {
    const question = {
      name: key,
      message: param.description,
    };

    if (param.type === "boolean") {
      question.type = "confirm";
      question.default = false;
    } else if (key === "type" && param.type === "string") {
      question.type = "list";
      question.choices = ["xml", "csv", "xmlZip", "csvZip"];
    } else if (key === "encoding") {
      question.type = "list";
      question.choices = [
        { name: "UTF-8 (65001)", value: "65001" },
        { name: "Shift-JIS (932)", value: "932" },
      ];
    } else if (
      key.toLowerCase().includes("mode") ||
      key === "thumbnailUpdate" ||
      key === "calculateEnable" ||
      key === "customMasterLinkage" ||
      key === "clusterThreshold"
    ) {
      question.type = "list";
      question.choices = [
        { name: "有効にする", value: "1" },
        { name: "無効にする", value: "0" },
      ];
    } else if (key.toLowerCase().includes("file")) {
      question.type = "input";
      question.validate = (input) =>
        input.length > 0 ? true : "ファイルパスを入力してください";
    } else {
      question.type = "input";
    }

    if (requiredParams.includes(key)) {
      const originalValidate = question.validate;
      question.validate = (input) => {
        if (!input && input !== false) return `${key}は必須項目です`;
        return originalValidate ? originalValidate(input) : true;
      };
    }

    questions.push(question);
  }

  const answers = await inquirer.prompt(questions);
  return answers;
}

// アクションのハンドリング
async function handleAction(action) {
  switch (action) {
    case "conversation":
      await startConversationMode();
      break;
    case "help":
      displayHelp();
      break;
    case "state":
      await displayState();
      break;
    case "clear":
      clearSession();
      break;
    case "exit":
      console.log("\nご利用ありがとうございました。");
      process.exit(0);
    default:
      await handleToolExecution(action);
  }

  if (action !== "exit" && !isConversationMode) {
    await showMainMenu();
  }
}

// ツール実行の処理
async function handleToolExecution(action) {
  const selectedTool = toolsConfig.find((t) => t.function.name === action);
  if (!selectedTool) {
    console.log("指定されたツールが見つかりません。");
    return;
  }

  currentTool = selectedTool.function;
  console.log(`\n${currentTool.description}`);

  try {
    // パラメータの入力
    const params = await promptForParameters(selectedTool);

    const { confirmed } = await inquirer.prompt([
      {
        type: "confirm",
        name: "confirmed",
        message: "実行してよろしいですか？",
        default: true,
      },
    ]);

    if (confirmed) {
      const result = await executeCommand(currentTool.name, params);
      displayResult(result);
    } else {
      console.log("実行をキャンセルしました。");
    }
  } catch (error) {
    console.error("エラーが発生しました:", error);
  }
}

// コマンド実行
async function executeCommand(commandName, params) {
  try {
    const importPath = `./commands/${
      commandName.charAt(0).toUpperCase() + commandName.slice(1)
    }.js`;

    const { action } = await import(importPath);
    return await action(params);
  } catch (error) {
    console.error(`コマンド実行エラー: ${error.message}`);
    return null;
  }
}

// 状態表示
async function displayState() {
  console.log("\n=== 現在の状態 ===");
  if (currentTool) {
    console.log("現在のツール:", currentTool.name);
    console.log(
      "収集済みパラメータ:",
      JSON.stringify(collectedParams, null, 2)
    );
  } else {
    console.log("ツール: 未選択");
  }
  console.log("会話履歴:", memory.length, "件");
  console.log("===============");

  // 詳細表示の確認
  const { showDetails } = await inquirer.prompt([
    {
      type: "confirm",
      name: "showDetails",
      message: "詳細を表示しますか？",
      default: false,
    },
  ]);

  if (showDetails) {
    console.log("\n=== 会話履歴 ===");
    memory.forEach((entry, index) => {
      console.log(`${index + 1}. ${entry.role}: ${entry.content}`);
    });
  }
}

// ヘルプ表示
function displayHelp() {
  console.log("\n=== アイレポちゃん CLI ヘルプ ===");
  console.log("利用可能な機能:");
  toolsConfig.forEach((tool) => {
    console.log(`- ${tool.function.name}: ${tool.function.description}`);
  });
  console.log("\nモード:");
  console.log("- メニューモード: 選択式で操作を行えます");
  console.log("- 会話モード: 自然な日本語で指示できます");
  console.log("\nシステムコマンド:");
  console.log("- conversation: 会話モードに切り替え");
  console.log("- menu: メニューモードに戻る（会話モード中）");
  console.log("- help: このヘルプを表示");
  console.log("- state: 現在の状態を表示");
  console.log("- clear: セッションをクリア");
  console.log("- exit: プログラムを終了");
  console.log("\n操作方法:");
  console.log("- ↑↓キー: 選択肢の移動");
  console.log("- Enter: 選択の確定");
  console.log("- Ctrl+C: キャンセル/終了");
  console.log("===========================");
}
// セッションクリア
function clearSession() {
  memory = [];
  currentTool = null;
  collectedParams = {};
  console.log("\n💬 アイレポちゃん> セッションをクリアしました。");
}

// 結果表示
function displayResult(result) {
  console.log("\n=== 実行結果 ===");
  if (result) {
    if (typeof result === "string") {
      console.log(result);
    } else {
      console.log(JSON.stringify(result, null, 2));
    }
  }

  if (result && result.error && result.error.code !== "0") {
    console.log(
      "\n💬 アイレポちゃん> 申し訳ありません。エラーが発生したようです。"
    );
    console.log("エラーの詳細を確認して、もう一度お試しください。");
  } else {
    const followupMessages = [
      "\n💬 アイレポちゃん> 処理が完了しました！",
      "他に何かお手伝いできることはありますか？",
      "例えば：",
      "・別の帳票を作成",
      "・CSVをダウンロード",
      "・レポートの詳細を確認",
      "・天気情報の取得",
      "",
      "システムコマンド：",
      "・help  : 使用可能な機能一覧を表示",
      "・state : 現在の状態を表示",
      "・clear : 会話をクリア",
      "・戻る  : モード選択に戻る",
    ];

    console.log(followupMessages.join("\n"));
  }
}

// Ctrl+C のハンドリング
process.on("SIGINT", () => {
  console.log("\n\nプログラムを終了します。ご利用ありがとうございました。");
  process.exit(0);
});

console.log("\n=== アイレポちゃん CLI へようこそ！ ===");
console.log("以下のモードから選択してください：");
console.log("- 🤖 AI会話モード: 自然な日本語で指示できます");
console.log("- 📋 選択会話モード: メニューから選択できます");
console.log("========================================\n");

// プログラムの開始
showMainMenu().catch(console.error);
