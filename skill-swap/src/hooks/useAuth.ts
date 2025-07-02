async function register(
  firstname: string,
  lastname: string,
  email: string,
  password: string
) {
  const response = await fetch(
    `${import.meta.env.VITE_BASE_API}/auth/register`,
    {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ firstname, lastname, email, password }),
    }
  );

  if (!response.ok) {
    throw new Error("Registration failed");
  }

  return await response.json();
}

async function login(email: string, password: string) {
  const response = await fetch(`${import.meta.env.VITE_BASE_API}/auth/login`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ email, password }),
  });

  if (!response.ok) {
    throw new Error("Login failed");
  }

  return await response.json();
}

async function logout() {
  const response = await fetch(`${import.meta.env.VITE_BASE_API}/auth/logout`, {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
    },
  });

  if (!response.ok) {
    throw new Error("Logout failed");
  }

  return await response.json();
}

export { register, login, logout };
