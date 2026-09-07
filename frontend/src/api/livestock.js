import client from "./client";

export const getLivestock = (farmId, params = {}) =>
  client.get(`/farms/${farmId}/livestock`, { params }).then((res) => res.data);

export const getLivestockDetail = (farmId, recordId) =>
  client.get(`/farms/${farmId}/livestock/${recordId}`).then((res) => res.data);

export const createLivestock = (farmId, data) =>
  client.post(`/farms/${farmId}/livestock`, data).then((res) => res.data);

export const getEvents = (farmId, recordId) =>
  client
    .get(`/farms/${farmId}/livestock/${recordId}/events`)
    .then((res) => res.data);

export const addEvent = (farmId, recordId, data) =>
  client
    .post(`/farms/${farmId}/livestock/${recordId}/events`, data)
    .then((res) => res.data);
