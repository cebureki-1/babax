const API_BASE_URL = "http://localhost:4000";

async function parseJsonSafe(res) {
  const text = await res.text();
  if (!text) return null;
  try {
    return JSON.parse(text);
  } catch {
    return text;
  }
}

export async function apiGet(path) {
  const res = await fetch(`${API_BASE_URL}${path}`, {
    method: "GET",
    headers: { Accept: "application/json" }
  });

  const data = await parseJsonSafe(res);
  if (!res.ok) {
    throw new Error(typeof data === "string" ? data : "Request failed");
  }
  return data;
}

export async function apiPost(path, body) {
  const res = await fetch(`${API_BASE_URL}${path}`, {
    method: "POST",
    headers: { "Content-Type": "application/json", Accept: "application/json" },
    body: JSON.stringify(body)
  });

  const data = await parseJsonSafe(res);
  if (!res.ok) {
    throw new Error(
      data && typeof data === "object" && data.error
        ? JSON.stringify(data.error)
        : "Request failed"
    );
  }
  return data;
}

export async function apiPut(path, body) {
  const res = await fetch(`${API_BASE_URL}${path}`, {
    method: "PUT",
    headers: { "Content-Type": "application/json", Accept: "application/json" },
    body: JSON.stringify(body)
  });

  const data = await parseJsonSafe(res);
  if (!res.ok) {
    throw new Error(
      data && typeof data === "object" && data.error
        ? JSON.stringify(data.error)
        : "Request failed"
    );
  }
  return data;
}

export async function apiDelete(path) {
  const res = await fetch(`${API_BASE_URL}${path}`, {
    method: "DELETE"
  });
  if (!res.ok && res.status !== 204) {
    const data = await parseJsonSafe(res);
    throw new Error(typeof data === "string" ? data : "Request failed");
  }
}

