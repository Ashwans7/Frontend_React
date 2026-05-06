import axios from 'axios';

const BASE_URL = 'https://devdiary-jmqa.onrender.com/';

export const api = axios.create({
  baseURL: BASE_URL,
});

export const IMAGE_URL = (filename) => {
  if (!filename) return null;
  // If it's already a full URL (Cloudinary), return as-is
  if (filename.startsWith('http')) return filename;
  // Legacy: local filename served from backend
  return `${BASE_URL}/images/${filename}`;
};

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
