# i-Repo-CLI-COPILOT>

![image](https://i.gyazo.com/6942fa80f8f5daa6d2839b844dd90cec.jpg)

## 概要

i-Repo CLI Copilot は i-Reporter の API をコマンド操作で利用可能とするツールです。AI との対話が可能で CLI としても利用出来る i-Reporter の運用支援ツールです。MIT ライセンスで提供されユーザーの皆さんは自由に利用できます。

### 各ファイルの役割

- `.env`: ルートフォルダに環境変数を定義する.env ファイルを作成し定義します。OPEN AI もしくは AZURE OPEN AI の情報を入れます。

```
OPENAI_API_KEY=your_openai_api_key
API_BASE_URL=https://アイレポAPIエンドポイント/ConMasAPI/Rests/APIExecute.aspx
API_USER=アイレポユーザー名
API_PASSWORD=アイレポユーザーパスワード
AZURE_OPEN_AI_KEY=your_azure_openai_key
AZURE_OPENAI_ENDPOINT=https://hogehoge.openai.azure.com/
AZURE_OPENAI_DEPLOYMENT_NAME=your_azure_openai_deployment_name
AZURE_OPENAI_API_VERSION=2024-00-00-preview
LLM_MODEL=gpt-4o-mini

```

- `ai.js`: ユーザー入力を AI が解釈し適切なコマンドを実行します。

- `cli.js`: CLI ツールのエントリーポイント。コマンドの読み込みと実行を行います。

#### `commands/` フォルダ

- `DownloadCsv.js`: レポート ID に基づいて CSV ファイルをダウンロードするコマンド。
- `GetReportDetail.js`: トップ ID に基づいてレポートの詳細を取得するコマンド。
- etc...

#### `utils/` フォルダ

- `openai.js`: OpenAI AI との通信を行うモジュール。
- `sessionManager.js`: セッション管理を行うモジュール。
- `toolsConfig.js`: 各コマンドの設定を定義するモジュール。これは function calling を行うためのモジュールです。

## インストール

```sh
npm install
```

### AI or コマンド選択モードの使い方

```sh
node ai.js
```

を実行すると AI 会話モードもしくは選択モードを選択します。
以下は選択会話モードで自動帳票作成をした例です。
![image](https://i.gyazo.com/8762469ed1af8a827b03de5f54f903ab.png)

### CLI としての使い方

```sh
node cli　[command] [options]
```

![alt text](https://i.gyazo.com/ab2d692d9ff1fb850622beb9a64aa3b2.png)

### コマンドの例

```js
node cli GetReportFile pdf -r 42337
```

### テストの実行

```sh
npm test
```

上記コマンドで Jest を用いた単体テストを実行できます。

# 免責事項

本ソフトウェア「i-Repo CLI Copilot」は、i-Reporter API を活用したコミュニティ主導のオープンソースプロジェクトとして提供されています。以下の点にご留意ください：

1. **非公式ツールについて**

   - 本ツールは、有志のユーザーによって開発・メンテナンスされている非公式のツールです
   - i-Reporter の開発元・提供元とは一切関係がありません
   - 公式のサポートや保証は提供されません

2. **使用に関する責任**

   - 本ツールの使用によって生じたいかなる損害や問題について、開発者は一切の責任を負いません
   - ユーザーは自己責任のもとで本ツールを使用するものとします
   - 本番環境での使用前に、必ずテスト環境での動作確認を行ってください

3. **セキュリティとデータの取り扱い**

   - API 認証情報等の機密情報は、ユーザーの責任のもとで適切に管理してください
   - 本ツールを使用する際は、所属する組織のセキュリティポリシーに準拠してください

4. **サポートとメンテナンス**

   - 本ツールは MIT ライセンスのもとで提供されます
   - アップデートやバグ修正は、コミュニティの貢献に依存します
   - 技術的なサポートは、いたしました。ただし、可能な範囲での対応となります

5. **改善への貢献**
   - バグの報告や機能改善の提案は、GitHub の Issue にて受け付けています
   - プルリクエストによる貢献を歓迎します

本ツールを使用することで、上記の免責事項に同意したものとみなされます。

---
