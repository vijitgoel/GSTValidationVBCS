import fetch from "node-fetch";

// The handler function for the API
export default async function handler(req, res) {
  // Allow CORS
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader("Access-Control-Allow-Headers", "*");
  res.setHeader("Access-Control-Allow-Methods", "GET, POST, OPTIONS");

  // Handle OPTIONS request (CORS preflight)
  if (req.method === "OPTIONS") {
    return res.status(200).end();
  }

  // Only handle POST requests
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  // Extract the parameters from the request body
  const {
    fusionUrl,
    adminUsername,
    adminPassword,
    username,
    personNumber,
    defaultPassword
  } = req.body;

  if (!fusionUrl || !adminUsername || !adminPassword || !username || !personNumber || !defaultPassword) {
    return res.status(400).json({
      error: "Missing required parameters: fusionUrl, adminUsername, adminPassword, username, personNumber, defaultPassword are required"
    });
  }

  // ✅ SCIM compliant payload as per your requirement
  const payload = {
    schemas: [
      "urn:scim:schemas:core:2.0:User"
    ],
    active: true,
    userName: username,          // map username
    password: defaultPassword,  // map default password
    externalId: personNumber    // map personNumber
  };

  try {
    const response = await fetch(
      `${fusionUrl}/hcmRestApi/scim/Users`,   // change endpoint if needed
      {
        method: "POST",
        headers: {
          "Authorization": `Basic ${Buffer.from(`${adminUsername}:${adminPassword}`).toString("base64")}`,
          "Content-Type": "application/scim+json"
        },
        body: JSON.stringify(payload)
      }
    );

    if (!response.ok) {
      const errorText = await response.text();
      return res.status(response.status).json({ 
        error: `Error creating SCIM user: ${errorText}` 
      });
    }

    const data = await response.json();
    return res.status(200).json(data);

  } catch (err) {
    return res.status(500).json({
      error: `Internal server error: ${err.message}`
    });
  }
}
