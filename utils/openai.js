import dotenv from "dotenv";
dotenv.config();

import OpenAI from "openai";

// OpenAIの場合はこちらを使う
// const openai = new OpenAI({
//   apiKey: process.env.OPENAI_API_KEY,
// model: "gpt-4o-mini",
// });

// AzureOpenAIの場合はこちらを使う
const openai = new OpenAI({
  apiKey: process.env.AZURE_OPEN_AI_KEY,
  baseURL: `${process.env.AZURE_OPENAI_ENDPOINT}/openai/deployments/${process.env.AZURE_OPENAI_DEPLOYMENT_NAME}`,
  defaultQuery: { "api-version": process.env.AZURE_OPENAI_API_VERSION },
  defaultHeaders: {
    "api-key": process.env.AZURE_OPEN_AI_KEY,
    "Content-Type": "application/json",
  },
  model: "gpt-4o-mini",
});

export { openai };
