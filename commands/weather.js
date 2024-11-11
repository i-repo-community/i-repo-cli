import fetch from "node-fetch";
import dotenv from "dotenv";

dotenv.config();

export async function action({ location }) {
  const apiKey = process.env.WEATHER_API_KEY;
  const url = `http://api.openweathermap.org/data/2.5/weather?q=${location}&appid=${apiKey}&units=metric`;

  try {
    const response = await fetch(url);
    const data = await response.json();

    if (data.cod === 200) {
      console.log(`現在の${location}の天気: ${data.weather[0].description}`);
      console.log(`気温: ${data.main.temp}°C`);
    } else {
      console.log(`天気情報が見つかりません: ${data.message}`);
    }
  } catch (error) {
    console.error("天気情報の取得中にエラーが発生しました:", error);
  }
}

// `default`エクスポートとしてCLIコマンドを定義
export default function (program) {
  program
    .command("weather <location>")
    .description("Get current weather information for a location")
    .action((location) => {
      action({ location });
    });
}
