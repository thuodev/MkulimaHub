import client from "./client";

export const getMembers = (farmId) =>
  client.get(`/farms/${farmId}/members`).then((res) => res.data);

export const createEmployee = (farmId, data) =>
  client.post(`/farms/${farmId}/employees`, data).then((res) => res.data);

export const removeMember = (farmId, userId) =>
  client.delete(`/farms/${farmId}/members/${userId}`);

export const addExistingMember = (farmId, data) =>
  client.post(`/farms/${farmId}/members`, data).then((res) => res.data);
