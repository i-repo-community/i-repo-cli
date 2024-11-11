export const toolsConfig = [
  {
    type: "function",
    function: {
      name: "weather",
      description: "指定された場所の天気情報を取得します。",
      parameters: {
        type: "object",
        properties: {
          location: {
            type: "string",
            description: "天気情報を取得する場所の名前",
          },
        },
        required: ["location"],
      },
    },
  },
  {
    type: "function",
    function: {
      name: "GetReportDetail",
      description: "特定の帳票ID(Top ID)の詳細を取得します。",
      parameters: {
        type: "object",
        properties: {
          topId: {
            type: "string",
            description: "レポートのトップID",
          },
        },
        required: ["topId"],
      },
    },
  },
  {
    type: "function",
    function: {
      name: "DownloadCsv",
      description: "指定されたレポートIDのCSVファイルをZIP形式でダウンロード。",
      parameters: {
        type: "object",
        properties: {
          reportId: {
            type: "string",
            description: "ダウンロードするレポートのID",
          },
          withImage: {
            type: "boolean",
            description: "画像を含めるかどうか",
          },
          withPDF: {
            type: "boolean",
            description: "PDFを含めるかどうか",
          },
          withPDFLayer: {
            type: "boolean",
            description: "PDFにレイヤーを含めるかどうか",
          },
          encoding: {
            type: "string",
            description: "エンコーディング形式（例: 932）",
          },
        },
        required: ["reportId"],
      },
    },
  },
  {
    type: "function",
    function: {
      name: "AutoGenerate",
      description: "ユーザーの指定するファイルから帳票を作成します。",
      parameters: {
        type: "object",
        properties: {
          type: {
            type: "string",
            description: "ファイルタイプ。xml, csv, xmlZip, csvZipなど。",
          },
          dataFile: {
            type: "string",
            description: "帳票XML/CSVデータ。ファイルパスの指定",
          },
          encoding: {
            type: "string",
            description:
              "エンコード。例: utf8の場合は932,shift-jisの場合は65001",
          },
          userMode: {
            type: "string",
            description:
              "'1'を指定するとファイル中の「作成ユーザー」が帳票登録者として登録されます。",
          },
          labelMode: {
            type: "string",
            description: "'1'を指定すると最下層のラベルのみに紐づけられます。",
          },
          defaultMode: {
            type: "string",
            description: "デフォルト値が指定できるクラスターの扱い方。",
          },
          thumbnailUpdate: {
            type: "string",
            description: "0: 更新しない、1: 更新する",
          },
          calculateEnable: {
            type: "string",
            description: "0: 動作させない、1: 動作させる",
          },
          customMasterLinkage: {
            type: "string",
            description: "0: 連動させない、1: 連動させる",
          },
          clusterThreshold: {
            type: "string",
            description:
              "最小、最大、正常最小、正常最大のクラスター参照を動作可否。0: 動作させない、1: 動作させる",
          },
        },
        required: ["type", "dataFile"],
      },
    },
  },
  {
    type: "function",
    function: {
      name: "GetReportFile",
      description: "PDF, EXCELファイルを指定された形式で取得します。",
      parameters: {
        type: "object",
        properties: {
          report: {
            type: "string",
            description: "帳票ID",
          },
          fileType: {
            type: "string",
            description: "ファイル種類 (pdf, pdfLayer, excel)",
            enum: ["pdf", "pdfLayer", "excel"],
          },
          systemKey1: {
            type: "string",
            description: "システムキー1",
          },
          systemKey2: {
            type: "string",
            description: "システムキー2",
          },
          systemKey3: {
            type: "string",
            description: "システムキー3",
          },
          systemKey4: {
            type: "string",
            description: "システムキー4",
          },
          systemKey5: {
            type: "string",
            description: "システムキー5",
          },
          fileName: {
            type: "string",
            description:
              "ファイル保存先と名称指定。拡張子を除くファイル名。fileTypeで指定した拡張子が付与されます。未指定時は自動出力設定の名称。",
          },
          pageNo: {
            type: "string",
            description:
              "出力ページ指定。カンマ区切りで複数指定、範囲指定はハイフン。例: 1,3,5-7 (fileTypeがpdfかpdfLayerの場合のみ)",
          },
          isInitValueChageDisplay: {
            type: "number",
            description:
              "初期入力値変更表示。0: しない、1: する (fileTypeがpdfの場合のみ)",
            enum: [0, 1],
          },
        },
        required: ["fileType", "report"], // report または systemKey1~5 systemKeyでやりたい人は修正
      },
    },
  },
];
