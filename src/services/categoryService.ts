import api from './api';

export const getAllCategories = async () => {
  try {
    const { data } = await api.get('/categories');
    return data.data || [];
  } catch (error) {
    console.error('Error fetching categories:', error);
    return [];
  }
};
