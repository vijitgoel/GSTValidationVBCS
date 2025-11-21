import fetch from "node-fetch";

export default async function handler(req, res) {
  const { fusionUrl, username, password, limit = 100, offset = 0 } = req.query;

  if (!fusionUrl || !username || !password) {
    return res.status(400).json({
      error: "fusionUrl, username and password are mandatory"
    });
  }

  const auth = Buffer.from(`${username}:${password}`).toString("base64");

  // Add CORS headers to the response
  res.setHeader("Access-Control-Allow-Origin", "*"); // Allow all origins
  res.setHeader("Access-Control-Allow-Methods", "GET, POST, OPTIONS"); // Allow these methods
  res.setHeader("Access-Control-Allow-Headers", "Content-Type, Authorization"); // Allow these headers

  // If it's a preflight OPTIONS request, just respond with 200
  if (req.method === "OPTIONS") {
    return res.status(200).end();
  }

  try {
    const url = `${fusionUrl}/hcmRestApi/resources/11.13.18.05/rolesLOV?` +
      `fields=RoleId,RoleName,RoleCode&onlyData=true&limit=${limit}&offset=${offset}`;

    const response = await fetch(url, {
      method: "GET",
      headers: {
        "Authorization": `Basic ${auth}`,
        "Content-Type": "application/json"
      }
    });

    const text = await response.text();

    if (!response.ok) {
      return res.status(response.status).json({
        error: text
      });
    }

    const data = JSON.parse(text);

    res.status(200).json(data);

  } catch (err) {
    res.status(500).json({
      error: err.message
    });
  }
}
