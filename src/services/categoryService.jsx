import apiClient from "./apiClient";

export const getCategories = () =>
  apiClient.get("/Categories").then((res) => res.data);

export const createCategory = (data) => apiClient.post("/Categories", data);

export const updateCategory = (id, data) =>
  apiClient.put(`/Categories/${id}`, data);

export const deleteCategory = (id) => apiClient.delete(`/Categories/${id}`);
