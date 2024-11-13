# irepo-cli

## 概要

irepo-cli2 は、レポートのダウンロードや詳細取得、天気情報の取得などを行う CLI ツールです。

## フォルダ構成

.DS_Store .env cli.js commands/ ask.js DownloadCsv.js GetReportDetail.js weather.js index.js package.json utils/ openai.js sessionManager.js toolsConfig.js

### 各ファイルの役割

- `.env`: 環境変数を定義するファイル。
- `cli.js`: CLI ツールのエントリーポイント。コマンドの読み込みと実行を行います。
- `index.js`: ユーザー入力を解釈し、適切なコマンドを実行します。
- `package.json`: プロジェクトの依存関係やスクリプトを定義するファイル。

#### `commands/` フォルダ

- `ask.js`: 質問を受け付け、処理を実行するコマンド。
- `DownloadCsv.js`: レポート ID に基づいて CSV ファイルをダウンロードするコマンド。
- `GetReportDetail.js`: トップ ID に基づいてレポートの詳細を取得するコマンド。
- `weather.js`: 指定された場所の天気情報を取得するコマンド。

#### `utils/` フォルダ

- `openai.js`: OpenAI API との通信を行うモジュール。
- `sessionManager.js`: セッション管理を行うモジュール。
- `toolsConfig.js`: 各コマンドの設定を定義するモジュール。

## インストール

```sh
npm install

使用方法
CLIコマンドの実行
以下のコマンドを使用して、各機能を実行できます。

質問をする
node [cli.js](http://_vscodecontentref_/10) ask --question "あなたの質問"

CSVファイルをダウンロードする

node [cli.js](http://_vscodecontentref_/11) DownloadCsv <reportId> [options]

オプション:

--no-image: 画像を除外
--no-pdf: PDFを除外
--no-pdf-layer: PDFレイヤーを除外
--encoding <encoding>: エンコーディング形式を指定 (デフォルト: 932)


環境変数
.envファイルに以下の環境変数を設定してください。
OPENAI_API_KEY=your_openai_api_key
API_BASE_URL=https://your_api_base_url
API_USER=your_api_user
API_PASSWORD=your_api_password
WEATHER_API_KEY=your_weather_api_key
```
