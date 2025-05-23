const express = require("express");
const axios = require("axios");
const app = express();

app.use(express.json());

app.post("/api/alert", async (req, res) => {
  const data = req.body;

  if (!data.alerts || !Array.isArray(data.alerts)) {
    return res.status(400).send("Invalid alert payload");
  }

  console.log("Received alerts:");

  for (const alert of data.alerts) {
    const status = alert.status;
    const alertname = alert.labels.alertname;
    const instance = alert.labels.instance;
    const summary = alert.annotations.summary || "(no summary)";
    const startsAt = alert.startsAt;

    const text = `🚨 *[${status.toUpperCase()}]* ${alertname} di ${instance}\n📝 ${summary}\n🕒 Mulai: ${startsAt}`;

    console.log(text);

    try {
      const response = await axios.get(
        "https://wa-gateway.bukansarjanakomputer.web.id/message/send-text",
        {
          params: {
            session: "trial01@email.com",
            to: "6285707947308",
            text: text,
          },
        }
      );

      console.log("WA response:", response.data);
    } catch (err) {
      console.error("Gagal kirim ke WhatsApp:", err.message);
    }
  }

  res.status(200).send("Alerts processed and forwarded");
});

app.listen(4000, () => {
  console.log("API listening on port 4000");
});
