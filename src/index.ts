import "dotenv/config";
import { serve } from "@hono/node-server";
import { Hono } from "hono";

import { sendEmail } from "./utils/nodmailer.js";
import { getCommunityMembersById } from "./utils/firebase.js";
import sendMessage from "./utils/whatsapp.js";

const app = new Hono();

app.get("/", (c) => {
  return c.text("Hello Hono!");
});

app.post("/:id", async (c) => {
  const id = c.req.param("id");

  console.log("User id: ", id);

  if (!id) {
    return c.json({ error: "User id is required" }, 400);
  }

  const requestBody = await c.req.json();
  const { name, latitude, longitude, address } = requestBody;

  try {
    const communityMembers = await getCommunityMembersById(id);
    console.log("Community Members: ", { communityMembers });

    communityMembers.forEach(async (member) => {
      await sendEmail(member.email, { name, address });
      await sendMessage(member.phoneNumber, name, address);
      console.log(`Email sent to: ${member.email}`);
    });

    return c.json({
      message: "Emails are being sent to community members.",
      communityMembers,
    });
  } catch (error) {
    console.error("Error fetching community members: ", error);
    return c.json(
      { error: "Failed to fetch community members", data: error },
      500
    );
  }
});

const port = 3000;
console.log(`Server is running on http://localhost:${port}`);

serve({
  fetch: app.fetch,
  port,
});

export default app;
