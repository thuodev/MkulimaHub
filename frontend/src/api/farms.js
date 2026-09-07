import client from "./client";

export const getFarms = () => client.get("/farms").then((res) => res.data);

export const createFarm = (data) =>
  client.post("/farms", data).then((res) => res.data);
