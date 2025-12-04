import api from './api';

// Submit score
export const submitScore = async (photoId: string, score: number, comment?: string) => {
  const { data } = await api.post('/scores', {
    photoId,
    score,
    comment: comment || 'Score submitted',
  });
  return data;
};

// Get photo scores
export const getPhotoScores = async (photoId: string) => {
  const { data } = await api.get(`/scores?photoId=${photoId}`);
  return data.data || [];
};

// Get photo total score
export const getPhotoTotalScore = async (photoId: string) => {
  const { data } = await api.get(`/scores/photo/${photoId}/total`);
  return data.data?.totalScore || 0;
};
