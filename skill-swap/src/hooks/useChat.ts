async function getAllConversations(abortController: AbortSignal | null = null) {
  const response = await fetch(`${import.meta.env.VITE_BASE_API}/chat/`, {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
    },
    credentials: "include", // Include cookies in the request
    signal: abortController, // Pass the abort signal if provided
  });

  if (!response.ok) {
    throw new Error("Failed to fetch conversations");
  }

  return await response.json();
}

async function getAllConversationMessages(
  conversationId: string,
  abortController: AbortSignal | null = null
) {
  const response = await fetch(
    `${import.meta.env.VITE_BASE_API}/chat/${conversationId}/`,
    {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      },
      credentials: "include", // Include cookies in the request
      signal: abortController, // Pass the abort signal if provided
    }
  );

  if (!response.ok) {
    throw new Error("Failed to fetch conversation messages");
  }

  return await response.json();
}

async function sendMessage(
  conversationId: string,
  content: string,
  abortController: AbortSignal | null = null
) {
  const response = await fetch(`${import.meta.env.VITE_BASE_API}/chat/send`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    credentials: "include", // Include cookies in the request
    body: JSON.stringify({
      conversationId,
      content,
    }),
    signal: abortController, // Pass the abort signal if provided
  });
  if (!response.ok) {
    throw new Error("Failed to send message");
  }
  return await response.json();
}
export { getAllConversations, getAllConversationMessages, sendMessage };
