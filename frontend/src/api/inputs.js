import client from "./client";

export const getInputs = (farmId, params = {}) =>
  client.get(`/farms/${farmId}/inputs`, { params }).then((res) => res.data);

export const getCategories = (farmId) =>
  client.get(`/farms/${farmId}/inputs/categories`).then((res) => res.data);

export const createInput = (farmId, data) =>
  client.post(`/farms/${farmId}/inputs`, data).then((res) => res.data);

export const getTransactions = (farmId, inputId) =>
  client
    .get(`/farms/${farmId}/inputs/${inputId}/transactions`)
    .then((res) => res.data);

export const addTransaction = (farmId, inputId, data) =>
  client
    .post(`/farms/${farmId}/inputs/${inputId}/transactions`, data)
    .then((res) => res.data);
