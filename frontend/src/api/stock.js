import client from "./client";

export const getStockItems = (farmId, params = {}) =>
  client.get(`/farms/${farmId}/stock`, { params }).then((res) => res.data);

export const createStockItem = (farmId, data) =>
  client.post(`/farms/${farmId}/stock`, data).then((res) => res.data);

export const getMovements = (farmId, stockItemId) =>
  client
    .get(`/farms/${farmId}/stock/${stockItemId}/movements`)
    .then((res) => res.data);

export const addMovement = (farmId, stockItemId, data) =>
  client
    .post(`/farms/${farmId}/stock/${stockItemId}/movements`, data)
    .then((res) => res.data);
