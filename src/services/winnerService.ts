import api from './api';

// Get all winners
export const getAllWinners = async () => {
  const { data } = await api.get('/winners');
  return data.winners;
};

// Get winners by category
export const getWinnersByCategory = async (categoryId: string) => {
  const { data } = await api.get(`/winners/category/${categoryId}`);
  return data.winners;
};

// Declare winners (Judge/Admin only)
export const declareWinners = async () => {
  const { data } = await api.post('/winners/declare');
  return data;
};
