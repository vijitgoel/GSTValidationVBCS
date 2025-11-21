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
  const { fusionUrl, adminUsername, adminPassword, username, personNumber, defaultPassword, roles } = req.body;

  if (!fusionUrl || !adminUsername || !adminPassword || !username || !personNumber || !defaultPassword || !roles || roles.length === 0) {
    return res.status(400).json({
      error: "Missing required parameters: fusionUrl, adminUsername, adminPassword, username, personNumber, defaultPassword, and roles are required"
    });
  }

  // Create the payload for creating the new user
  const payload = {
    PersonNumber: personNumber,
    Username: username,
    userAccountRoles: roles.map(role => ({ RoleCode: role }))  // Assuming roles are passed as an array of role codes
  };

  try {
    // Make the POST request to Fusion HCM's userAccounts endpoint
    const response = await fetch(`${fusionUrl}/hcmRestApi/resources/11.13.18.05/userAccounts`, {
      method: "POST",
      headers: {
        "Authorization": `Basic ${Buffer.from(`${adminUsername}:${adminPassword}`).toString("base64")}`,
        "Content-Type": "application/vnd.oracle.adf.resourceitem+json"
      },
      body: JSON.stringify(payload)
    });

    // Check if the response is okay
    if (!response.ok) {
      const errorText = await response.text();
      return res.status(response.status).json({ error: `Error creating user: ${errorText}` });
    }

    // Parse the response and return it
    const data = await response.json();
    return res.status(200).json(data);

  } catch (err) {
    return res.status(500).json({ error: `Internal server error: ${err.message}` });
  }
}
