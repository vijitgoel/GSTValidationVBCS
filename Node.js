const express = require("express");
const fetch = require("node-fetch");
const app = express();
app.use(express.json());

// Enable CORS for VBCS domain
app.use((req, res, next) => {
  res.header("Access-Control-Allow-Origin", "*"); 
  res.header("Access-Control-Allow-Headers", "*");
  res.header("Access-Control-Allow-Methods", "GET, POST, OPTIONS");
  if (req.method === "OPTIONS") return res.sendStatus(200);
  next();
});

app.post("/gst-validate", async (req, res) => {
  try {
    const response = await fetch(
      "https://fincare2.girnarsoft.co.in/rest/master/addressFromGST.php",
      {
        method: "POST",
        headers: {
          "api-key": "08845a45ae8f26c7123b386d94c3f43e",
          auth: "65c13a55816e8931d3b4ae5a2176e695",
          "content-type": "application/json",
        },
        body: JSON.stringify(req.body),
      }
    );

    const data = await response.json();
    res.json(data);

  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

app.listen(3000, () => console.log("Proxy API running"));
