# i-Repo-CLI-COPILOT>

![image](https://i.gyazo.com/6942fa80f8f5daa6d2839b844dd90cec.jpg)

## 概要

i-Repo CLI Copilot は i-Reporter の API をコマンド操作で利用可能とするツールです。AI との対話が可能で CLI としても利用出来る i-Reporter の運用支援ツールです。MIT ライセンスで提供されユーザーの皆さんは自由に利用できます。

### 各ファイルの役割

- `.env`: ルートフォルダに環境変数を定義する.env ファイルを作成し定義します。OPEN AI もしくは AZURE OPEN AI の情報を入れます。

```
OPENAI_API_KEY=your_openai_api_key
API_BASE_URL=https://hogehoge/ConMasAPI/Rests/APIExecute.aspx
API_USER=your_irepo_user
API_PASSWORD=your_irepo_user_password
AZURE_OPEN_AI_KEY=your_azure_openai_key
AZURE_OPENAI_ENDPOINT=https://hogehoge.openai.azure.com/
AZURE_OPENAI_DEPLOYMENT_NAME=your_azure_openai_deployment_name
AZURE_OPENAI_API_VERSION=2024-00-00-preview

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
