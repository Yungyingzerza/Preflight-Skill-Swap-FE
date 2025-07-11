async function getPendingOffers(abortController: AbortSignal | null = null) {
  const response = await fetch(
    `${import.meta.env.VITE_BASE_API}/request/pending-offers`,
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
    throw new Error("Failed to fetch pending offers");
  }

  return await response.json();
}

async function acceptOffer(
  offerId: string,
  skillId: string,
  abortController: AbortSignal | null = null
) {
  const response = await fetch(
    `${import.meta.env.VITE_BASE_API}/request/accept-offer/`,
    {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ offerId, skillId }),
      credentials: "include", // Include cookies in the request
      signal: abortController, // Pass the abort signal if provided
    }
  );

  if (!response.ok) {
    throw new Error("Failed to accept offer");
  }

  return await response.json();
}

async function rejectOffer(
  offerId: string,
  abortController: AbortSignal | null = null
) {
  const response = await fetch(
    `${import.meta.env.VITE_BASE_API}/request/reject-offer/`,
    {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ offerId }),
      credentials: "include", // Include cookies in the request
      signal: abortController, // Pass the abort signal if provided
    }
  );

  if (!response.ok) {
    throw new Error("Failed to reject offer");
  }

  return await response.json();
}

async function completeOffer(
  offerId: string,
  abortController: AbortSignal | null = null
) {
  const response = await fetch(
    `${import.meta.env.VITE_BASE_API}/request/complete-offer/`,
    {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ offerId }),
      credentials: "include", // Include cookies in the request
      signal: abortController, // Pass the abort signal if provided
    }
  );

  if (!response.ok) {
    throw new Error("Failed to complete offer");
  }

  return await response.json();
}
export { getPendingOffers, acceptOffer, rejectOffer, completeOffer };
