import api from "./axios";

// empréstimo
export async function simulateLoan(data) {
  const res = await api.post("/simulations/loan", data);
  return res.data;
}

// investimento
export async function simulateInvestment(data) {
  const res = await api.post("/simulations/investment", data);
  return res.data;
}

// histórico
export async function getHistory() {
  const res = await api.get("/simulations/history");
  return res.data;
}

// comparação
export async function compareSimulations(data) {
  const res = await api.post("/simulations/compare", data);
  return res.data;
}
