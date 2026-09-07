import client from "./client";

export const getDashboard = (farmId) =>
  client.get(`/farms/${farmId}/dashboard`).then((res) => res.data);
