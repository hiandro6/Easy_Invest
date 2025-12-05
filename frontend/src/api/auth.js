import api from "./axios";

// LOGIN (FastAPI usa FormData)
export async function login(email, password) {
  const form = new FormData();
  form.append("username", email);
  form.append("password", password);

  const res = await api.post("/users/login", form);
  return res.data;
}

// REGISTER
export async function register(data) {
  const res = await api.post("/users/register", data);
  return res.data;
}
