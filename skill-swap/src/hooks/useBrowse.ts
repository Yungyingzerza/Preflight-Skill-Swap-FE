async function search(
  input: string,
  abortController: AbortSignal | null = null
) {
  const response = await fetch(
    `${import.meta.env.VITE_BASE_API}/browse/search`,
    {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ input }),
      credentials: "include", // Include cookies in the request
      signal: abortController, // Pass the abort signal if provided
    }
  );

  if (!response.ok) {
    throw new Error("Search failed");
  }

  return await response.json();
}

async function getTargetUserData(
  targetUserId: string,
  abortController: AbortSignal | null = null
) {
  const response = await fetch(
    `${import.meta.env.VITE_BASE_API}/browse/get-target-user-data`,
    {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ targetUserId }),
      credentials: "include", // Include cookies in the request
      signal: abortController, // Pass the abort signal if provided
    }
  );

  if (!response.ok) {
    throw new Error("Failed to fetch target user data");
  }

  return await response.json();
}

async function sendRequest(
  targetUserId: string,
  skillId: string,
  abortController: AbortSignal | null = null
) {
  const response = await fetch(
    `${import.meta.env.VITE_BASE_API}/browse/request-swap`,
    {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ targetUserId, skillId }),
      credentials: "include", // Include cookies in the request
      signal: abortController, // Pass the abort signal if provided
    }
  );
  if (!response.ok) {
    const data = await response.json();
    throw new Error(data.message);
  }
  return await response.json();
}

export { search, getTargetUserData, sendRequest };
