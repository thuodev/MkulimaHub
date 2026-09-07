import client from "./client";

export const getFields = (farmId, params = {}) =>
  client.get(`/farms/${farmId}/fields`, { params }).then((res) => res.data);

export const createField = (farmId, data) =>
  client.post(`/farms/${farmId}/fields`, data).then((res) => res.data);

export const updateField = (farmId, fieldId, data) =>
  client
    .put(`/farms/${farmId}/fields/${fieldId}`, data)
    .then((res) => res.data);

export const deleteField = (farmId, fieldId) =>
  client.delete(`/farms/${farmId}/fields/${fieldId}`);
