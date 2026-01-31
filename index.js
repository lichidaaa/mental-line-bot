const express = require("express");
const axios = require("axios");

const app = express();
app.use(express.json());

// 優しいメッセージたち
const messages = [
  "今日も生きててえらいね",
  "ここまで来たの、ほんとにすごい",
  "何もできなくてもOKな日です",
  "返事しなくていいからね",
  "今日もあなたの味方です"
];

// テスト用：アクセスしたらLINEに送る
app.get("/", async (req, res) => {
  const message = messages[Math.floor(Math.random() * messages.length)];

  try {
    await axios.post(
      "https://api.line.me/v2/bot/message/broadcast",
      {
        messages: [{ type: "text", text: message }]
      },
      {
        headers: {
          Authorization: `Bearer ${process.env.CHANNEL_ACCESS_TOKEN}`,
          "Content-Type": "application/json"
        }
      }
    );
    res.send("LINEに送信しました");
  } catch (error) {
    console.error(error.response?.data);
    res.status(500).send("送信エラー");
  }
});

// Webhook用エンドポイント（LINE公式アカウントからの通知を受ける）
app.post("/webhook", (req, res) => {
  console.log("Webhookイベント受信:", req.body); // ログ確認用
  res.sendStatus(200); // LINEは必ず200を返す必要があります
});

const port = process.env.PORT || 3000;
app.listen(port, () => {
  console.log(`Server running on ${port}`);
});
