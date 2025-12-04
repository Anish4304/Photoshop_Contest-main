import api from './api';

// Submit vote
export const submitVote = async (photoId: string, visitorEmail: string, visitorName: string) => {
  // First, create or get visitor
  const visitorResponse = await api.post('/votes/visitors', {
    name: visitorName,
    email: visitorEmail,
  });
  const visitorId = visitorResponse.data.data._id;

  // Then submit vote
  const { data } = await api.post('/votes', {
    photoId,
    visitorId,
  });
  return data;
};

// Get photo votes count
export const getPhotoVotes = async (photoId: string) => {
  const { data } = await api.get(`/votes/photo/${photoId}/count`);
  return data.data?.voteCount || 0;
};
