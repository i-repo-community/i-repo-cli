export async function action({ question }) {
  console.log(`質問を受け付けました: ${question}`);
  // ここで質問に基づいた処理を実行（例: AI応答生成）
}
export default function (program) {
  program
    .command("ask")
    .description("ask")
    .action(async (ask) => {
      action({ ask });
    });
}
