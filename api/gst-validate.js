import fetch from "node-fetch";

export default async function handler(req, res) {
  // Allow CORS
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader("Access-Control-Allow-Headers", "*");
  res.setHeader("Access-Control-Allow-Methods", "GET, POST, OPTIONS");

  if (req.method === "OPTIONS") {
    return res.status(200).end();
  }

  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  try {
    const response = await fetch(
      "https://fincare2.girnarsoft.co.in/rest/master/addressFromGST.php",
      {
        method: "POST",
        headers: {
          "api-key": "08845a45ae8f26c7123b386d94c3f43e",
          "auth": "65c13a55816e8931d3b4ae5a2176e695",
          "content-type": "application/json"
        },
        body: JSON.stringify(req.body)
      }
    );

    const data = await response.json();
    return res.status(200).json(data);

  } catch (err) {
    return res.status(500).json({ error: err.message });
  }
}
