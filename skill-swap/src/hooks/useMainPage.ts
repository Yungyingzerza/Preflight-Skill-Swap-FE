async function editUserProfile(
  firstname: string,
  lastname: string,
  bio: string,
  picture: File,
  abortController: AbortSignal | null = null
) {
  //form data to send
  const formData = new FormData();
  formData.append("firstname", firstname);
  formData.append("lastname", lastname);
  formData.append("bio", bio);
  if (picture) {
    formData.append("picture", picture);
  }

  const response = await fetch(
    `${import.meta.env.VITE_BASE_API}/main/edit-profile`,
    {
      method: "POST",
      body: formData,
      credentials: "include", // Include cookies in the request
      signal: abortController, // Pass the abort signal if provided
    }
  );

  if (!response.ok) {
    throw new Error("Profile update failed");
  }

  return await response.json();
}

async function getUserSkillLearn(abortController: AbortSignal | null = null) {
  const response = await fetch(
    `${import.meta.env.VITE_BASE_API}/main/get-user-skills-learn`,
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
    throw new Error("Failed to fetch user skills");
  }
  return await response.json();
}

async function getNumberOfUserSkills(
  abortController: AbortSignal | null = null
) {
  const response = await fetch(
    `${import.meta.env.VITE_BASE_API}/main/get-number-of-user-skills`,
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
    throw new Error("Failed to fetch number of user skills");
  }
  return await response.json();
}

async function getUserSkills(abortController: AbortSignal | null = null) {
  const response = await fetch(
    `${import.meta.env.VITE_BASE_API}/main/get-user-skills`,
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
    throw new Error("Failed to fetch user skills");
  }
  return await response.json();
}

async function editUserSkills(
  skills: { skills: { id: string }[] },
  abortController: AbortSignal | null = null
) {
  const response = await fetch(
    `${import.meta.env.VITE_BASE_API}/main/edit-user-skills`,
    {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(skills),
      credentials: "include", // Include cookies in the request
      signal: abortController, // Pass the abort signal if provided
    }
  );

  if (!response.ok) {
    throw new Error("Edit user skills failed");
  }

  return await response.json();
}

async function editUserSkillsLearn(
  skills: { skills: { id: string }[] },
  abortController: AbortSignal | null = null
) {
  const response = await fetch(
    `${import.meta.env.VITE_BASE_API}/main/edit-user-skills-learn`,
    {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(skills),
      credentials: "include", // Include cookies in the request
      signal: abortController, // Pass the abort signal if provided
    }
  );

  if (!response.ok) {
    throw new Error("Edit user skills learn failed");
  }

  return await response.json();
}

async function getSwapHistory(abortController: AbortSignal | null = null) {
  const response = await fetch(
    `${import.meta.env.VITE_BASE_API}/main/get-swap-history`,
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
    throw new Error("Failed to fetch swap history");
  }

  return await response.json();
}

export {
  editUserProfile,
  getUserSkillLearn,
  getNumberOfUserSkills,
  getUserSkills,
  editUserSkills,
  editUserSkillsLearn,
  getSwapHistory,
};
