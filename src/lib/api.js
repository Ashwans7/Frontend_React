import axios from 'axios';

const DEFAULT_API_URL = import.meta.env.DEV
  ? 'http://localhost:3000'
  : 'https://devdiary-jmqa.onrender.com';

const BASE_URL = (import.meta.env.VITE_API_URL || DEFAULT_API_URL).replace(/\/$/, '');

export const api = axios.create({
  baseURL: BASE_URL,
});

const cloudinaryImageUrl = (url, width) => {
  if (!url.includes('res.cloudinary.com') || !url.includes('/upload/')) return url;

  const transforms = ['f_auto', 'q_auto'];
  if (width) transforms.push('c_fill', `w_${width}`);

  return url.replace('/upload/', `/upload/${transforms.join(',')}/`);
};

export const IMAGE_URL = (filename, options = {}) => {
  if (!filename) return null;
  // If it's already a full URL (Cloudinary), return as-is
  if (filename.startsWith('http')) return cloudinaryImageUrl(filename, options.width);
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
