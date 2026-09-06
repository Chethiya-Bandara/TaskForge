const API_URL = "http://localhost:5000/api";

export async function getContacts() {
  const response = await fetch(`${API_URL}/contacts`);

  if (!response.ok) {
    throw new Error("Failed to fetch contacts");
  }

  return response.json();
}