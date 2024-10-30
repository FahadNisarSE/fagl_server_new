const url = "https://graph.facebook.com/v21.0/476347172227559/messages";
const token =
  "EAAFE5EbHcQ4BOZCDoWsKL95KbthpnEoLsteQpseZCOFBXLfrVjvo8KGOkflST2Txhnaeyup6U1wt8NmY8kLsXwHDyuj0FFyZCrcQ2w1yMzJzZCoZAVBQ9ez6VyLhZAl9fN6ZCuvegzBKe1c9OZCvYrSCLIvRfx1kVgAJN1iCWAjA3kHKlCebZAZCW8V96urefPhWQjYOZBG9s9bWE6UJa3uA9ZAzClucDEmn";

const sendMessage = async (
  recipientNumber: string,
  name: string,
  address: string
) => {
  console.log("Recipent phone: ", recipientNumber);
  const data = {
    messaging_product: "whatsapp",
    to: recipientNumber,
    type: "template",
    template: {
      name: "emergency_alert",
      language: {
        code: "en",
      },
      components: [
        {
          type: "body",
          parameters: [
            { type: "text", text: name },
            { type: "text", text: address },
          ],
        },
      ],
    },
  };

  const response = await fetch(url, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${token}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify(data),
  });

  if (!response.ok) {
    throw new Error(`HTTP error! status: ${response.status}`);
  }

  return await response.json();
};

export default sendMessage;
