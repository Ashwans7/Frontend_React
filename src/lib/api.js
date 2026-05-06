import axios from 'axios';

const BASE_URL = 'https://devdiary-jmqa.onrender.com/';

export const api = axios.create({
  baseURL: BASE_URL,
});

export const IMAGE_URL = (filename) =>
  filename ? `${BASE_URL}/images/${filename}` : null;

export const blogApi = {
  getAll: () => api.get('/blog'),
  getOne: (id) => api.get(`/blog/${id}`),
  create: (formData) =>
    api.post('/blog', formData, {
      headers: { 'Content-Type': 'multipart/form-data' },
    }),
  update: (id, formData) =>
    api.patch(`/blog/${id}`, formData, {
      headers: { 'Content-Type': 'multipart/form-data' },
    }),
  delete: (id) => api.delete(`/blog/${id}`),
};
